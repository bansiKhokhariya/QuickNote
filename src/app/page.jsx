'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Editor } from 'novel';
import toast from 'react-hot-toast'

export default function Home() {
  const [title, setTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    const getNovelContentData = localStorage.getItem('novel__content');
    const parsedNovelContent = JSON.parse(getNovelContentData);

    if (!title) return toast.error('Please enter a title before publishing.');;
    setIsPublishing(true);

    try {
      const response = await fetch('/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          editor_content: parsedNovelContent,
        }),
      });

      const data = await response.json();
      if (data.success) {

        toast.success('Note published successfully!');

        // Update local storage with multiple note IDs
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        noteIds.push(data.note._id);
        localStorage.setItem('noteIds', JSON.stringify(noteIds));
        // Redirect to edit page with the new note ID
        router.push(`/${data.note._id}`);
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

  const handleNewNote = () => {
    localStorage.removeItem('novel__content');
    router.push(`/`);
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
            className={` py-2 bg-blue-500 text-white rounded ${isPublishing ? 'opacity-50' : ''}`}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
          <button className="  py-2 bg-black text-white rounded" onClick={handleNewNote}>My Notes</button>
        </div>
      </div>
      <div className="w-full p-4">
        <Editor />
      </div>
    </div>
  );
}



