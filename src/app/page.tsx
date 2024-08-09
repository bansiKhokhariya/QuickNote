"use client";
import Editor from "@/components/editor/advanced-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import { JSONContent } from "novel";
import { useState } from "react";
import { defaultValue } from "./default-value";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Home() {
  const [title, setTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const [value, setValue] = useState<JSONContent>(defaultValue);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
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
        toast.success('Note published successfully!');

        // Update local storage with multiple note IDs
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        noteIds.push(data.note.noteUniqueId);
        localStorage.setItem('noteIds', JSON.stringify(noteIds));

        // Redirect to edit page with the new note ID
        router.push(`/${data.note.noteUniqueId}`);
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
            className={`py-2 bg-blue-500 text-white rounded border ${isPublishing ? 'opacity-50' : ''}`}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
          <button className="py-2 bg-black text-white rounded border" onClick={handleMyNotes}>
            My Notes
          </button>
        </div>
      </div>
      <div className="w-full p-4">
        <div className="mb-5">
          <ThemeToggle />
        </div>
        <Editor initialValue={value} onChange={setValue} />
      </div>
    </div>
  );
}
