import mongoose, { Schema, Types } from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);