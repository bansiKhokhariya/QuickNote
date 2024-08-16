import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/libs/mongoose';
import Note from '@/models/NoteSchema';
import User from '@/models/User';
import crypto from 'crypto';

// Function to generate a unique 6-character ID
const generateUniqueId = async () => {
  const generateId = () => crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-character string
  let uniqueId = generateId();
  const existingNote = await Note.findOne({ noteUniqueId: uniqueId });
  while (existingNote) {
    uniqueId = generateId();
  }
  return uniqueId;
};

export async function GET(req: NextRequest) {

  await connectMongo();
  const noteUniqueId = req.nextUrl.searchParams.get('noteUniqueId');
  const email = req.nextUrl.searchParams.get('email');

  try {
    let notes;
    if (email) {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      // Use the user's ID to find all notes associated with that user
      notes = await Note.find({ user: user._id });
    } else if (noteUniqueId) {

      // If email is not provided, find the specific note by its unique ID
      const note = await Note.findOne({ noteUniqueId });
      if (note) {
        notes = note; // Convert single note to array for consistent return type
      }
    }

    if (!notes || notes.length === 0) {
      return NextResponse.json({ success: false, error: 'No notes found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const body = await req.json();
    const { noteUniqueId, title, editor_content, email } = body;

    let result;
    if (noteUniqueId) {
      // Update existing note by noteUniqueId
      result = await Note.findOneAndUpdate(
        { noteUniqueId },
        { title, editor_content },
        { new: true, runValidators: true }
      );
      if (!result) {
        return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
      }
    } else {
      let userId = null;
      if (email) {
        const user = await User.findOne({ email });
        if (!user) {
          return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        userId = user._id;
      }
      // Create a new note with a unique noteUniqueId
      const uniqueNoteId = await generateUniqueId();
      const newNote = new Note({
        title,
        editor_content,
        noteUniqueId: uniqueNoteId,
        user: userId
      });
      result = await newNote.save();
    }

    return NextResponse.json({ success: true, note: result });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ success: false, error: 'Failed to save note' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectMongo();

  const noteUniqueId = req.nextUrl.searchParams.get('noteUniqueId');
  try {
    if (noteUniqueId) {
      const result = await Note.findOneAndDelete({ noteUniqueId });
      if (!result) {
        return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'No note ID provided' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 });
  }
}

