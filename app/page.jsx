"use client";
import React, { useState, useEffect, useContext } from "react";
import Editor from "@/components/editor/advanced-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import toast from "react-hot-toast";
import { defaultValue } from "./default-value";
import Login from '@/components/magicLink/Login'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Save, ListOrdered, X, BadgePlus } from 'lucide-react'
import { useSession, signIn } from "next-auth/react";
import TaskModal from '@/components/dialog/TaskModal';

export default function Home() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState();
  const [value, setValue] = useState(defaultValue);
  const [noteUniqueId, setNoteUniqueId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorkey, setEditorKey] = useState(false);
  const [theme, setTheme] = useState("light");

  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const currentUrl = `https://quick-note-snowy.vercel.app/${noteUniqueId}`;

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const openTaskModal = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const handlePublish = async () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
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
          email: session?.user?.email
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update local storage with multiple note IDs
        if (!session?.user) {
          const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
          noteIds.push(data.note.noteUniqueId);
          localStorage.setItem('noteIds', JSON.stringify(noteIds));
        }
        setNoteUniqueId(data.note.noteUniqueId)
        toast.success('Note published successfully!');
        setIsModalOpen(true);
      } else {
        toast.error('Failed to publish note');
      }
    } catch (error) {
      console.error('Error publishing note:', error);
      toast.error('An error occurred while publishing the note.');
    } finally {
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

  const handleSignIn = async () => {
    try {
      await signIn('email', { email, callbackUrl: `/${noteUniqueId}` });
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const handleGuestModal = () => {
    if (session?.user) {
      router.push(`/${noteUniqueId}`);
    } else {
      if (email) {
        handleSignIn();
      } else {
        router.push(`/${noteUniqueId}`);
      }
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`
  };

  const handleSubmit = async ({ topicName, keywords  }) => {
    setTitle(topicName);
    setEditorKey(true)
    try {
      const response = await fetch('/api/generate-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicName, keywords }),
      });

      const data = await response.json();

      if (data.success) {
        // Create content for topicName
        const topicContent = {
          type: "paragraph",
          content: [
            {
              "type": "text",
              "marks": [
                {
                  "type": "bold"
                }
              ],
              "text": "Topic Name: "
            },
            {
              "type": "text",
              text: `${data.topicName}`
            }
          ]
        };

        // Create content for keywords
        const keywordsArray = data.keywords.split(',').map(keyword => keyword.trim());
        const keywordsContent = {
          type: "paragraph",
          content: [
            {
              "type": "text",
              "marks": [
                {
                  "type": "bold"
                }
              ],
              "text": "Keywords: "
            },
            {
              "type": "text",
              text: `\n${keywordsArray.join('\n')}`
            }
          ]
        };

        // Convert the generated URLs and titles into separate ProseMirror JSON structures

        const URL = {
          type: "paragraph",
          content: [
            {
              "type": "text",
              "marks": [
                {
                  "type": "bold"
                }
              ],
              "text": "Domain Names: "
            },
          ]
        };

        const domainNamesContent = data.domainNames.map(url => ({
          type: "paragraph",
          content: [
            {
              "type": "text",
              "marks": [
                {
                  "type": "link",
                  "attrs": {
                    "href": `https://${url}`,
                    "target": "_blank",
                    "rel": "noopener noreferrer nofollow",
                    "class": "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
                  }
                }
              ],
              "text": `${url}`
            }
          ]
        }));

        const CfTitle = {
          type: "paragraph",
          content: [
            {
              "type": "text",
              "marks": [
                {
                  "type": "bold"
                }
              ],
              "text": "CF NAME: "
            },
          ]
        };

        const cfTitlesContent = data.cfNames.map(title => ({
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `${title}`
            }
          ]
        }));

        // Combine all the contents together
        // Filter out any empty or null content blocks from value.content
        const filteredContent = value?.content?.filter(block => {
          return (
            block?.content?.length > 0 &&
            block.content[0]?.text?.trim() !== ""
          );
        });

        // Update the value with the new content structure
        const updatedValue = {
          ...value,
          content: [
            ...filteredContent,
            topicContent,
            keywordsContent,
            URL,
            ...domainNamesContent,
            CfTitle,
            ...cfTitlesContent,
          ],
        };

        setValue(updatedValue);
        setEditorKey(true);
      } else {
        console.error('Failed to generate task');
      }
    } catch (error) {
      console.error('Error generating task:', error);
    }
  };

  const handleEditorChange = (newValue) => {
    setValue(newValue);
    setEditorKey(false); // Reset key state to false when value changes
  };

  return (
    <>
      <div className="container mx-auto p-5">
        <div className="flex w-full justify-between items-center gap-1 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter note title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-1 border rounded text-[8px] sm:text-lg"
            />
            <div onClick={handlePublish}>
              <Button className="md:block hidden px-10">Save</Button>
              <div className='md:hidden block'>
                <Button variant="outline" size="icon">
                  <Save className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            </div>
            <div onClick={handleMyNotes}>
              <Button className="md:block hidden px-10">My Notes</Button>
              <div className='md:hidden block'>
                <Button variant="outline" size="icon">
                  <ListOrdered className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            </div>
            <div onClick={openTaskModal}>
              <Button className="md:block hidden px-10">Generate Task</Button>
              <div className='md:hidden block'>
                <Button variant="outline" size="icon">
                  <BadgePlus className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <ThemeToggle />
            <Login/>
          </div>
        </div>
        <div>
          <Editor
            key={editorkey ? JSON.stringify(value) : undefined}
            initialValue={value}
            onChange={handleEditorChange}
          />
        </div>
      </div>

      <TaskModal isOpen={isTaskModalOpen} theme={theme} onClose={closeTaskModal} onSubmit={handleSubmit} />

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
            {!session?.user && <div className="flex flex-col gap-1 mb-5">
              <label htmlFor="email" className="text-sm">Enter your email (optional):</label>
              <input
                id="email"
                type="email "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-sm p-2 border border-gray-300 rounded"
                required
              />
              <p className="text-xs text-green-500">This will create guest account</p>
            </div>}
            <div className="">
              <div>
                Your note URL:
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


