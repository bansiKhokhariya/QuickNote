'use client';
import React, { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { generateHTML } from '@tiptap/html';
import { defaultExtensions } from '@/lib/default-extensions';

const Page = ({ params }) => {
  const [title, setTitle] = useState('');
  const [novelContent, setNovelContent] = useLocalStorage('novel__content', '');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNote = async () => {
      const noteId = params.id;
      if (noteId) {
        try {
          const response = await fetch(`/api/note/?id=${noteId}`);
          const data = await response.json();
          if (data.success) {
            setTitle(data?.note?.title);
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
      }
    } else {
      toast.error('Sharing is not supported in this browser.');
    }
  };

  const output = useMemo(() => {
    try {
      if (!novelContent || typeof novelContent !== 'object') {
        console.warn('Invalid novel content, using fallback.');
        return '';
      }
      return generateHTML(novelContent, defaultExtensions);
    } catch (error) {
      console.error('Error in generateHTML:', error);
      return '';
    }
  }, [novelContent]);

  return (
    // <div className="flex flex-col items-center w-full min-h-screen py-12">
    //   <div className="w-full max-w-2xl p-4">
    //     {loading ? (
    //       <div className="text-center text-gray-500">Loading...</div>
    //     ) : (
    //       <>
    //         <h1>{title}</h1>

    //         <div className="prose" dangerouslySetInnerHTML={{ __html: output }}></div>

    //         <div className="mt-4 flex gap-4">
    //           <button
    //             onClick={handleNewNote}
    //             className="px-4 py-2 bg-gray-500 text-white rounded"
    //           >
    //             New Note
    //           </button>
    //           <button
    //             onClick={handleMyNotes}
    //             className="px-4 py-2 bg-gray-500 text-white rounded"
    //           >
    //             My Notes
    //           </button>
    //           <button
    //             onClick={handleShare}
    //             className="px-4 py-2 bg-blue-500 text-white rounded"
    //           >
    //             Share
    //           </button>
    //         </div>
    //       </>
    //     )}
    //   </div>
    // </div>



    <div className="flex flex-col lg:flex-row items-start w-full min-h-screen px-4 container mx-auto">
      <div className="w-full lg:w-1/4  p-4 ">
        <p className='text-center text-xl font-bold mb-5'>{title}</p>
        <div className="flex flex-col gap-4">
          <button className="py-2 bg-black text-white rounded" onClick={handleNewNote}>New Note</button>
          <button className="py-2 bg-black text-white rounded" onClick={handleMyNotes}>My Notes</button>
          <button className="py-2 bg-black text-white rounded" onClick={handleShare}>Share</button>
        </div>
      </div>
      <div className="w-full m-4 border rounded shadow p-4">
        <div className="prose" dangerouslySetInnerHTML={{ __html: output }}></div>
      </div>
    </div>

  );
};

export default Page;
