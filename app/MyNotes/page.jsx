'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash } from 'lucide-react';
import { useSession } from "next-auth/react";

export default function MyNotes() {
  const { data: session, status } = useSession();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Function to fetch notes from the server
    const fetchNotes = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          return data?.notes; // Assuming the API returns a note object when successful
        } else {
          console.error('Failed to fetch note:', data.error);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      }
      return null;
    };

    const loadNotes = async () => {
      setLoading(true); // Start loading
      if (session?.user) {
        // User is logged in, fetch notes using the user's email
        const url = `/api/note?noteUniqueId=null&email=${session.user.email}`;
        const notesList = await fetchNotes(url);
        setNotes(notesList);
      } else {
        // User is not logged in, fetch notes using IDs from local storage
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        const responses = await Promise.all(
          noteIds.map((id) => fetchNotes(`/api/note?noteUniqueId=${id}`))
        );
        // Filter out null responses and set the notes state
        const notesList = responses.filter((note) => note !== null);
        setNotes(notesList);
      }
      setLoading(false); // Stop loading
    };

    loadNotes();
  }, [session]); // Dependency on session to rerun when the session changes


  const handleEdit = (noteUniqueId) => {
    router.push(`/edit/${noteUniqueId}`);
  };

  const handleDelete = async (noteUniqueId) => {
    try {
      // Delete the note from the server
      const response = await fetch(`/api/note?noteUniqueId=${noteUniqueId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        // Remove the note ID from local storage
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        const updatedNoteIds = noteIds.filter(noteId => noteId !== noteUniqueId);
        localStorage.setItem('noteIds', JSON.stringify(updatedNoteIds));
        // Remove the note from the UI
        setNotes(notes.filter(note => note.noteUniqueId !== noteUniqueId));
      } else {
        toast.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('An error occurred while deleting the note.');
    }
  };

  const handleNewNote = () => {
    router.push(`/`);
  };

  return (
    <div className="py-12 container mx-auto">
      <div className="p-4">
        <div className='flex justify-between items-center mt-5 mb-5'>
          <p className='text-[30px]'><b>My Notes List</b> </p>
          <button className='bg-black text-white rounded-lg border px-4 py-2' onClick={handleNewNote}>+ New Note</button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="space-y-4">
            {notes.map(note => (
              <li key={note?._id} className="border p-4 mb-4 rounded shadow-md">
                <h2 className="text-lg font-semibold">{note?.title || 'Untitled'}</h2>
                <div className="mt-2 flex space-x-2">
                  <Pencil size={20} color='blue' className='cursor-pointer' onClick={() => handleEdit(note?.noteUniqueId)} />
                  <Trash size={20} color='red' className='cursor-pointer' onClick={() => handleDelete(note?.noteUniqueId)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}