'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Editor from "@/components/editor/advanced-editor";
import Login from '@/components/magicLink/Login'
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, ListOrdered, Pencil, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateHTML } from '@tiptap/html';
import { defaultExtensions } from '@/components/editor/extensions';
import Head from 'next/head';

const Page = ({ params }) => {
    const [value, setValue] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [contentHtml, setContentHtml] = useState('');
    const [hasChanges, setHasChanges] = useState(false); // Track if there are changes

    useEffect(() => {
        const isEditNote = localStorage.getItem('isEditNote');
        if (isEditNote === 'true') {
            setIsEditMode(true);
        }
    }, []);

    useEffect(() => {
        const noteId = params.id;
        const fetchNote = async () => {
            if (noteId) {
                try {
                    const response = await fetch(`/api/note/?noteUniqueId=${noteId}`);
                    const data = await response.json();
                    if (data.success) {
                        setTitle(data.notes.title || '');
                        const html = generateHTML(data.notes.editor_content, defaultExtensions);
                        setContentHtml(html);
                        setValue(data.notes.editor_content || null);
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

    const handleUpdate = async (updatedValue = value, updatedTitle = title) => {
        try {
            const response = await fetch('/api/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    noteUniqueId: params.id,
                    title: updatedTitle,
                    editor_content: updatedValue,
                }),
            });

            const data = await response.json();
            if (!data.success) {
                toast.error('Failed to update note');
            } else {
                setHasChanges(false); // Reset changes flag after a successful update
            }
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error('An error occurred while updating the note.');
        }
    };

    const toggleEditMode = () => {
        localStorage.removeItem('isEditNote');
        const html = generateHTML(value, defaultExtensions);
        setContentHtml(html);
        setIsEditMode(!isEditMode);
    };

    const handleNewNote = () => {
        router.push(`/`);
    };

    const handleMyNotes = () => {
        router.push(`/MyNotes`);
    };

    // Call handleUpdate when content changes and save button is clicked
    const saveChanges = () => {
        if (hasChanges) {
            handleUpdate(value, title);
        }
    };

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
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
                        <div className="flex w-full justify-between items-center gap-2 mb-5">
                            <div className="flex gap-2 items-center mb-2">
                                <input
                                    type="text"
                                    placeholder="Enter note title here"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        handleUpdate(value, title);
                                        setHasChanges(true); // Mark as changed
                                    }}
                                    className="p-1 border rounded text-[8px] sm:text-lg"
                                    disabled={!isEditMode}  // Disable input if not in edit mode
                                />
                                {isEditMode ? (
                                    <>
                                        <Button size="icon">
                                            <Eye
                                                size={20}
                                                className='cursor-pointer h-[1.2rem] w-[1.2rem]'
                                                onClick={toggleEditMode}
                                            />
                                        </Button>
                                        <div onClick={saveChanges}>
                                            <Button className="md:block hidden px-10">Save</Button>
                                            <div className='md:hidden block'>
                                                <Button variant="outline" size="icon">
                                                    <Save className="h-[1.2rem] w-[1.2rem]" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Button size="icon">
                                        <Pencil
                                            size={20}
                                            className='cursor-pointer h-[1.2rem] w-[1.2rem]'
                                            onClick={toggleEditMode}
                                        />
                                    </Button>
                                )}
                                <div onClick={handleNewNote}>
                                    <Button className="md:block hidden px-10">New Note</Button>
                                    <div className='md:hidden block'>
                                        <Button variant="outline" size="icon">
                                            <Plus className="h-[1.2rem] w-[1.2rem]" />
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
                            </div>
                            <div className="flex gap-2 mb-2">
                                <ThemeToggle />
                                <Login />
                            </div>
                        </div>
                        <div>
                            {isEditMode ? (
                                <Editor
                                    initialValue={value}
                                    onChange={(updatedValue) => {
                                        setValue(updatedValue);
                                        handleUpdate(updatedValue, title);
                                        setHasChanges(true); // Mark as changed
                                    }}
                                />
                            ) : (
                                <div className='tiptap ProseMirror prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full' dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Page;
