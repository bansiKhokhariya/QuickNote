import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '../../../lib/mongoose';
import Note from '../../../model/NoteSchema';

// GET handler to fetch notes
export async function GET(req: NextRequest) {
  await connectMongo();

  const noteId = req.nextUrl.searchParams.get('id');
  try {
    if (noteId) {
      const note = await Note.findById(noteId);
      if (!note) {
        return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, note });
    } else {
      const notes = await Note.find();
      return NextResponse.json({ success: true, notes });
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST handler to create or update notes
export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const body = await req.json();
    const { _id, title, editor_content } = body;

    let result;
    if (_id) {
      // Update existing note
      result = await Note.findByIdAndUpdate(
        _id,
        { title, editor_content },
        { new: true, runValidators: true }
      );
    } else {

      // Create a new note
      const newNote = new Note({
        title,
        editor_content,
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

  const noteId = req.nextUrl.searchParams.get('id');
  try {
    if (noteId) {
      const result = await Note.findByIdAndDelete(noteId);
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