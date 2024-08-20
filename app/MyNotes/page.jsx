'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash, Plus, Eye } from 'lucide-react';
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button'; // Import Select components
import Login from '@/components/magicLink/Login';
import { formatDistanceToNow, startOfToday, startOfYesterday, subDays, startOfMonth } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MyNotes() {
  const { data: session, status } = useSession();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Filter state
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('isEditNote');
  }, []);

  useEffect(() => {
    const fetchNotes = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          return data?.notes;
        } else {
          console.error('Failed to fetch note:', data.error);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      }
      return null;
    };

    const loadNotes = async () => {
      setLoading(true);
      let notesList = [];
      if (session?.user) {
        const url = `/api/note?noteUniqueId=null&email=${session.user.email}`;
        notesList = await fetchNotes(url);
      } else {
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        const responses = await Promise.all(
          noteIds.map((id) => fetchNotes(`/api/note?noteUniqueId=${id}`))
        );
        notesList = responses.filter((note) => note !== null);
      }

      // Sort notes by updatedAt in descending order to show the latest first
      notesList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // Apply filter to the notes
      const filteredNotes = applyFilter(notesList);

      setNotes(filteredNotes);
      setLoading(false);
    };

    loadNotes();
  }, [session, filter]); // Dependency on session and filter

  const applyFilter = (notes) => {
    const now = new Date();
    switch (filter) {
      case 'today':
        return notes.filter(note => new Date(note.createdAt) >= startOfToday());
      case 'yesterday':
        return notes.filter(note => {
          const createdAt = new Date(note.createdAt);
          return createdAt >= startOfYesterday() && createdAt < startOfToday();
        });
      case 'last7days':
        return notes.filter(note => new Date(note.createdAt) >= subDays(now, 7));
      case 'thismonth':
        return notes.filter(note => new Date(note.createdAt) >= startOfMonth(now));
      default:
        return notes;
    }
  };

  const handleEdit = (noteUniqueId) => {
    localStorage.setItem('isEditNote', 'true');
    router.push(`/${noteUniqueId}`);
  };

  const handleView = (noteUniqueId) => {
    router.push(`/${noteUniqueId}`);
  };

  const handleDelete = async (noteUniqueId) => {
    try {
      const response = await fetch(`/api/note?noteUniqueId=${noteUniqueId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
        const updatedNoteIds = noteIds.filter(noteId => noteId !== noteUniqueId);
        localStorage.setItem('noteIds', JSON.stringify(updatedNoteIds));
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
          <div className='flex items-center gap-2'>
            <p className='text-lg sm:text-[30px]'><b>My Notes List</b> </p>
          </div>
          <div className='flex gap-2'>
            <Button variant="outline" size="icon" onClick={handleNewNote}>
              <Plus className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <Login />
          </div>
        </div>
        <div className='mb-5'>
          <label>Filter by Created At &nbsp;</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='px-10'>{filter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("today")}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("yesterday")}>Yesterday</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("last7days")}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("thismonth")}>This Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="space-y-4">
            {notes && notes.length > 0 ? (
              notes.map(note => (
                <li key={note?._id} className="border p-4 mb-4 rounded shadow-md">
                  <h2 className="text-lg font-semibold">{note?.title || 'Untitled'}</h2>
                  <div className='flex justify-between gap-2 items-start flex-col sm:flex-row sm:items-center'>
                    <div className="mt-2 flex space-x-2">
                      <Pencil size={20} color='blue' className='cursor-pointer' onClick={() => handleEdit(note?.noteUniqueId)} />
                      <Trash size={20} color='red' className='cursor-pointer' onClick={() => handleDelete(note?.noteUniqueId)} />
                      <Eye size={20} color='blue' className='cursor-pointer' onClick={() => handleView(note?.noteUniqueId)} />
                    </div>
                    <p className="text-xs text-gray-500">
                      updated {formatDistanceToNow(new Date(note?.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center text-xl text-gray-500 mt-4">
                No notes found
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
