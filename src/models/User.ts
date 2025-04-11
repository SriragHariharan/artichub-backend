const defaultUserImage = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: false,
        default: defaultUserImage
    },
    interests: {
        type: [String],
        required: true,
    }
});

export default mongoose.model("User", userSchema);