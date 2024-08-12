"use client";

import React, { useState, useEffect } from "react";
import Editor from "@/components/editor/advanced-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import { JSONContent } from "novel";
import toast from "react-hot-toast";
import { defaultValue } from "./default-value";
import Login from '@/components/magicLink/Login'
import { magic } from '@/lib/magic';
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function Home() {
  const [title, setTitle] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [noteUniqueId, setNoteUniqueId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState("system"); // Default theme

  const [user, setUser] = useState(null);
  const router = useRouter();

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
        if (user) {
          toast.success('Note published successfully!');
          router.push(`/edit/${data.note.noteUniqueId}`);
        } else {
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
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start w-full min-h-screen px-4 container mx-auto">
      <div className="w-full lg:w-1/4  p-4 ">
        <input
          type="text"
          placeholder="Enter note title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <div className="flex flex-col gap-4">
          <button
            onClick={handlePublish}
            className={`py-2 bg-blue-500 text-white rounded border ${isPublishing ? "opacity-50" : ""
              }`}
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
          <button
            className="py-2 bg-black text-white rounded border"
            onClick={handleMyNotes}
          >
            My Notes
          </button>
        </div>
      </div>
      <div className="w-full p-4">
        <div className="mb-5 flex justify-between">
          <ThemeToggle />
          <Login redirectUrl={'/'} />
        </div>
        <Editor initialValue={value} onChange={setValue} />
      </div>

      {/* Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded shadow-lg w-96 border ${theme === "light" ? "bg-white" : "bg-black text-white"
              }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold ">Login with Magic Link</h2>
              <X size={24} color="red" onClick={toggleModal} />
            </div>
            <p className="mb-4">Logging in is not required if you want to</p>
            <Login redirectUrl={`/edit/${noteUniqueId}`} />
          </div>
        </div>
      )}
    </div>
  );
}
