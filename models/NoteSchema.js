import mongoose from 'mongoose';

const { Schema } = mongoose;

const noteSchema = new Schema({
    title: {
        type: String,
        trim: true,
    },
    editor_content: {
        type: mongoose.Schema.Types.Mixed,
    },
    noteUniqueId: {
        type: String,
        unique: true, 
        required: true,
        trim: true, 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

// Create and export the model
const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export default Note;
