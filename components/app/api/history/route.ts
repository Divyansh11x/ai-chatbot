import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  await connectDB();

  const chats = await Chat.find().sort({ _id: 1 });

  return Response.json(chats);
}