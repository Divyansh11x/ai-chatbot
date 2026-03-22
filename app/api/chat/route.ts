import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    await connectDB();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API KEY missing");
    }

    // ✅ Save user message
    await Chat.create({
      role: "user",
      text: message
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    const text = result.response.text();

    // ✅ Save bot reply
    await Chat.create({
      role: "assistant",
      text
    });

    return Response.json({ reply: text });

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return Response.json({
      reply: "Backend error aa gaya"
    });
  }
}