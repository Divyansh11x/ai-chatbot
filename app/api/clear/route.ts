import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function DELETE() {
  try {
    await connectDB();

    await Chat.deleteMany({});

    return Response.json({ success: true });

  } catch (error) {
    console.error("Clear error:", error);

    return Response.json({
      success: false
    });
  }
}