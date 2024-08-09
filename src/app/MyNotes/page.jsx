'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash } from 'lucide-react';

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch note IDs from local storage
    const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');

    // Fetch notes details from the server
    const fetchNotes = async () => {
      try {
        const responses = await Promise.all(noteIds.map(id => fetch(`/api/note?noteUniqueId=${id}`)));
        const notesData = await Promise.all(responses.map(res => res.json()));
        const notesList = notesData.filter(data => data.success).map(data => data.note);
        setNotes(notesList);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchNotes();
  }, []);

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
          <p><b>My Notes List</b> </p>
          <button className='bg-black text-white rounded-lg border px-4 py-2' onClick={handleNewNote}>+ New Note</button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">Loading...</div>
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
