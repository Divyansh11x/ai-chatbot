import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    await connectDB();

    const chats = await Chat.find().sort({ createdAt: 1 });

    console.log("Chats:", chats); // 👈 ADD THIS

    return Response.json(chats);
  } catch (error) {
    console.error("API ERROR:", error); // 👈 ADD THIS
    return Response.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}