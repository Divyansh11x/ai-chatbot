import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    await connectDB();

    const chats = await Chat.find().sort({ createdAt: 1 });

    console.log("Chats:", chats);

    return Response.json(chats);
  } catch (error: any) {
    console.error("FULL ERROR:", error); // 👈 IMPORTANT

    return Response.json(
      { error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}