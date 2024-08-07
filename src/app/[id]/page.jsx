'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { generateHTML } from '@tiptap/html';
import { defaultExtensions } from '@/lib/default-extensions';

const Page = ({ params }) => {
  const [title, setTitle] = useState('');
  const [novelContent, setNovelContent] = useLocalStorage('novel__content', '');
  const [loading, setLoading] = useState(true);
  const [contentHtml, setContentHtml] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchNote = async () => {
      const noteId = params.id;
      if (!noteId) {
        toast.error('Note ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/note/?id=${noteId}`);
        const data = await response.json();
        if (data.success) {
          setTitle(data?.note?.title || 'Untitled');
          setNovelContent(data?.note?.editor_content || '');
        } else {
          toast.error('Failed to load note');
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Error fetching note');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [params.id, setNovelContent]);

  useEffect(() => {
    if (novelContent && typeof novelContent === 'object') {
      try {
        // Convert JSON object to HTML if necessary
        const html = generateHTML(novelContent, defaultExtensions);
        setContentHtml(html);
      } catch (error) {
        console.error('Error generating HTML:', error);
        setContentHtml('<p>Error rendering content</p>');
      }
    } else {
      setContentHtml(novelContent || '<p>No content available</p>');
    }
  }, [novelContent]);

  const handleNewNote = () => {
    localStorage.removeItem('novel__content');
    router.push(`/`);
  };

  const handleMyNotes = () => {
    router.push(`/MyNotes`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: 'Check out this note!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing note:', error);
        toast.error('Error sharing note');
      }
    } else {
      toast.error('Sharing is not supported in this browser.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start w-full min-h-screen px-4 container mx-auto">
      <div className="w-full lg:w-1/4 p-4">
        <p className='text-center text-xl font-bold mb-5'>{title}</p>
        <div className="flex flex-col gap-4">
          <button className="py-2 bg-black text-white rounded" onClick={handleNewNote}>New Note</button>
          <button className="py-2 bg-black text-white rounded" onClick={handleMyNotes}>My Notes</button>
          <button className="py-2 bg-black text-white rounded" onClick={handleShare}>Share</button>
        </div>
      </div>
      <div className="w-full m-4 border rounded shadow p-4">
        {loading ? (
          <div className='text-center'>Loading...</div>
        ) : (
          <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
        )}
      </div>
    </div>
  );
};

export default Page;


