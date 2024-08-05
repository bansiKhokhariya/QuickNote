import mongoose from 'mongoose';

const { Schema } = mongoose;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from start and end
    },
    editor_content: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` timestamps
});

// Create and export the model
const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export default Note;
