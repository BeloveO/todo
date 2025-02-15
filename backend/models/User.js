import mongoose from "mongoose";


// User schema
const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}));

export default User;