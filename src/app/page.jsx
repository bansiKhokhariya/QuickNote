"use client";
import React, { useState, useEffect, useContext } from "react";
import Editor from "@/components/editor/advanced-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import toast from "react-hot-toast";
import { defaultValue } from "./default-value";
import Login from '@/components/magicLink/Login'
import { magic } from '@/lib/magic';
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserContext } from '@/lib/UserContext';
import Image from 'next/image'
import { Save, ListOrdered } from 'lucide-react'

export default function Home() {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [noteUniqueId, setNoteUniqueId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();

  const currentUrl = `https://quick-note-snowy.vercel.app/edit/${noteUniqueId}`;

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme);
    // Check if the user is logged in
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getInfo().then(setUser);
      }
    });
  }, []);

  const handlePublish = async () => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme);

    setIsPublishing(true);
    try {
      // Save the note first
      const response = await fetch('/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          editor_content: value,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update local storage with multiple note IDs
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        noteIds.push(data.note.noteUniqueId);
        localStorage.setItem('noteIds', JSON.stringify(noteIds));
        setNoteUniqueId(data.note.noteUniqueId)
        if (user?.email) {
          toast.success('Note published successfully!');
          router.push(`/edit/${data.note.noteUniqueId}`);
        } else {
          toast.success('Note published successfully!');
          setIsModalOpen(true);
        }
      } else {
        toast.error('Failed to publish note');
      }
    } catch (error) {
      console.error('Error publishing note:', error);
      toast.error('An error occurred while publishing the note.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleMyNotes = () => {
    router.push(`/MyNotes`);
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setEmail('')
    setIsModalOpen(!isModalOpen);
  };

  const handleLoginWithEmail = async (redirectUrl) => {
    try {
      // Use Magic SDK to log in with a magic link
      await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL(redirectUrl, window.location.origin).href,
      });

      // Get user information after login
      const userMetadata = await magic.user.getInfo();
      setUser(userMetadata);

      // Save user data to your backend
      await fetch('/api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userMetadata.email,
        }),
      });

    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleGuestModal = () => {
    if (email) {
      handleLoginWithEmail(`/edit/${noteUniqueId}`);
    } else {
      router.push(`/edit/${noteUniqueId}`);
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`
  };

  return (
    <>
      <div className="container mx-auto p-5">
        <div className="flex w-full justify-between items-center flex-wrap mb-5">
          <div className="flex items-center  gap-2 flex-wrap mb-2">
            <input
              type="text"
              placeholder="Enter note title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded text-xs sm:text-lg"
            />
            <div className="border p-1 rounded cursor-pointer flex justify-center" onClick={handlePublish}>
              <Button className="md:block hidden px-10">Save</Button>
              <Save className="sm:w-8 sm:h-8 w-5 h-5 md:hidden block" />
            </div>
            <div className="border p-1 rounded cursor-pointer flex justify-center" onClick={handleMyNotes}>
              <Button className="md:block hidden px-10">My Notes</Button>
              <ListOrdered className="sm:w-8 sm:h-8 w-5 h-5  md:hidden block" />
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <ThemeToggle />
            <Login redirectUrl={'/'} />
          </div>
        </div>
        <div>
          <Editor initialValue={value} onChange={setValue} />
        </div>
      </div>
      {/* Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded shadow-lg w-96 border ${theme === "light" ? "bg-white" : "bg-black text-white"
              }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold ">Make a Guest Account</h2>
              <X size={24} color="red" className="cursor-pointer" onClick={toggleModal} />
            </div>
            <div className="flex flex-col gap-1 mb-5">
              <label htmlFor="email" className="text-sm">Enter your email (optional):</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-sm p-2 border border-gray-300 rounded"
                required
              />
              <p className="text-xs text-green-500">This will create guest account</p>
            </div>
            <div className="">
              <div>
                Your note edit URL:
              </div>
              <p className="border p-2 mt-1 text-sm">
                {currentUrl}
              </p>
            </div>
            <Button className="w-full mt-6" onClick={handleGuestModal}>OK</Button>
            <div className="mt-3 flex justify-center">
              <div className='flex gap-2 items-center'>
                <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
                  <Image src='/svg/facebook.svg' width={30} height={30} className='rounded' alt='facebook' />
                </a>
                <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
                  <Image src='/svg/twitter.svg' width={30} height={30} className='rounded' alt='twitter' />
                </a>
                <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer">
                  <Image src='/images/whatsapp.webp' width={30} height={30} className='rounded w-7 h-7' alt='whatsapp' />
                </a>
                <a href={shareUrls.telegram} target="_blank" rel="noopener noreferrer">
                  <Image src='/svg/telegram.svg' width={35} height={35} className='rounded' alt='telegram' />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
