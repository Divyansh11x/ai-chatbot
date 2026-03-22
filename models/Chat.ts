import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  role: String,
  text: String
});

export default mongoose.models.Chat ||
  mongoose.model("Chat", ChatSchema);