import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

export default model("User", userSchema);
