'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Editor from "@/components/editor/advanced-editor";
import Login from '@/components/magicLink/Login'
import { ThemeToggle } from "@/components/theme-toggle";

const Page = ({ params }) => {
    const [value, setValue] = useState(null); // Ensure this is correctly initialized as null or a valid JSONContent object.
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const noteId = params.id;
        const fetchNote = async () => {
            if (noteId) {
                try {
                    const response = await fetch(`/api/note/?noteUniqueId=${noteId}`);
                    const data = await response.json();
                    if (data.success) {
                        setTitle(data.note.title || '');
                        // Ensure that `data.note.editor_content` is a valid JSONContent object
                        setValue(data.note.editor_content || null);
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
        try {
            const response = await fetch('/api/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    noteUniqueId: params.id,
                    title,
                    editor_content: value, // Make sure `value` is properly structured
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
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="container mx-auto p-5">
                        <div className="flex w-full justify-between items-center flex-wrap mb-5">
                            <div className="flex gap-2 flex-wrap mb-2">
                                <input
                                    type="text"
                                    placeholder="Enter note title here"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <button
                                    className="py-2 px-20 bg-black text-white rounded border"
                                    onClick={handleUpdate}
                                >
                                    Save
                                </button>
                                <button
                                    className="py-2 px-20 bg-black text-white rounded border"
                                    onClick={handleNewNote}
                                >
                                    New Note
                                </button>
                                <button
                                    className="py-2 px-20 bg-black text-white rounded border"
                                    onClick={handleMyNotes}
                                >
                                    My Notes
                                </button>
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
                </>
            )}
        </>
    );
};

export default Page;
