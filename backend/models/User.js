import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    displayName: String,
    email: String,
    password: { type: String, select: false }, // Don't return password by default
    securityQuestion: String,
    securityAnswer: { type: String, select: false }, // Encrypting answers is best practice too
});

mongoose.model("users", userSchema);
