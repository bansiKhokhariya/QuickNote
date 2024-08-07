
'use client';

import React, { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('novel').then(mod => mod.Editor), {
  ssr: false, // Disable server-side rendering for this component
});

const Page = ({ params }) => {
    const [title, setTitle] = useState('');
    const [novelContent, setNovelContent] = useLocalStorage('novel__content', '');
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if the note ID is in the noteIds array
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        const noteId = params.id;

        if (!noteIds.includes(noteId)) {
            setAccessDenied(true);
            setLoading(false);
            return;
        }

        // Fetch the note details on component mount
        const fetchNote = async () => {
            if (noteId) {
                try {
                    const response = await fetch(`/api/note/?noteUniqueId=${noteId}`);
                    const data = await response.json();
                    if (data.success) {
                        setTitle(data?.note?.title || '');
                        setNovelContent(data?.note?.editor_content || '');
                    } else {
                        toast.error('Failed to load note');
                    }
                } catch (error) {
                    console.error('Error fetching note:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchNote();
    }, [params.id]);

    const handleUpdate = async () => {
        const getNovelContentData = localStorage.getItem('novel__content');
        const parsedNovelContent = JSON.parse(getNovelContentData || '{}');

        try {
            const response = await fetch('/api/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    noteUniqueId: params.id,
                    title,
                    editor_content: parsedNovelContent,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Note updated successfully!');
            } else {
                toast.error('Failed to update note');
            }
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error('An error occurred while updating the note.');
        }
    };

    const handleNewNote = () => {
        localStorage.removeItem('novel__content');
        router.push(`/`);
    };

    const handleMyNotes = () => {
        router.push(`/MyNotes`);
    };

    return (
        <>
            {loading ? (
                <div className="flex flex-col items-center w-full min-h-screen py-12">
                    <div className="w-full max-w-2xl p-4">
                        <div className="text-center text-gray-500">Loading...</div>
                    </div>
                </div>
            ) : (
                <>
                    {!accessDenied ? (
                        <div className="flex flex-col lg:flex-row items-start w-full min-h-screen px-4 container mx-auto">
                            <div className="w-full lg:w-1/4 p-4">
                                <input
                                    type="text"
                                    placeholder="Enter note title here"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />
                                <div className="flex flex-col gap-4">
                                    <button
                                        className="py-2 bg-black text-white rounded"
                                        onClick={handleUpdate}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="py-2 bg-black text-white rounded"
                                        onClick={handleNewNote}
                                    >
                                        New Note
                                    </button>
                                    <button
                                        className="py-2 bg-black text-white rounded"
                                        onClick={handleMyNotes}
                                    >
                                        My Notes
                                    </button>
                                </div>
                            </div>
                            <div className="w-full p-4">
                                <Editor value={novelContent} onChange={setNovelContent} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full min-h-screen py-12">
                            <div className="w-full max-w-2xl p-4 flex flex-col items-center gap-5">
                                <div className="text-center text-[30px] text-gray-500">Sorry, page not found!</div>
                                <button
                                    className='bg-black text-white rounded-lg px-4 py-2'
                                    onClick={handleNewNote}
                                >
                                    + New Note
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Page;
