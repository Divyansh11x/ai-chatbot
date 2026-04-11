# 🤖 AI Chatbot (Next.js + MongoDB + Gemini)

A **full-stack AI chatbot application** built using **Next.js 16**, **MongoDB**, and **Google Gemini API**.  
It provides real-time AI conversations with **voice support, persistent chat history, and modern UI**.

---

## 🚀 Live Demo

🔗 https://your-vercel-url.vercel.app  
*(Add your deployed link here)*

---

## ✨ Features

- 💬 Real-time chat interface
- 🧠 AI-powered responses (Gemini 2.5 Flash)
- 💾 Persistent chat history (MongoDB)
- 🎤 Speech-to-Text (Voice input)
- 🔊 Text-to-Speech (AI speaks replies)
- ⚡ Typing animation effect
- 🧹 Clear chat functionality
- 📝 Markdown rendering (formatted AI responses)
- 🎨 Clean, responsive UI (Dark theme)

---

## 🛠️ Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend    | Next.js 16, React, Tailwind CSS |
| Backend     | Next.js API Routes |
| Database    | MongoDB + Mongoose |
| AI Engine   | Google Gemini API |
| Language    | TypeScript |

---

## 📂 Project Structure

```
ai-chatbot/
│── app/
│   ├── api/
│   │   ├── chat/        # AI response API
│   │   ├── history/     # Fetch chat history
│   │   └── clear/       # Clear chat endpoint
│   ├── page.tsx
│
│── components/
│   └── ChatBox.tsx      # Main UI + Voice + Markdown
│
│── lib/
│   └── mongodb.ts       # DB connection
│
│── models/
│   └── Chat.ts          # Chat schema
│
│── .env.local
│── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Divyansh11x/ai-chatbot.git
cd ai-chatbot
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup environment variables

Create `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

---

### 4️⃣ Run the project

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## ⚠️ Common Issues & Fixes

### ❌ MongoDB not connecting
- Check `MONGODB_URI`
- Ensure **Network Access = Allow all (0.0.0.0/0)** in MongoDB Atlas

### ❌ Backend error on Vercel
- Add environment variables in **Vercel → Settings → Environment Variables**

### ❌ Speech Recognition not working
- Works best in **Chrome browser**
- Requires **HTTPS (on deployment)**

---

## 📈 Future Improvements

- 🔐 User Authentication (Google login)
- 🧠 Chat sessions (like ChatGPT)
- 📊 Analytics dashboard
- 🌐 Multi-language support
- ⚡ Streaming responses
- 📱 Mobile UI optimization

---

## 🧠 Key Learning Outcomes

- Full-stack development with Next.js App Router
- API design & integration
- MongoDB data persistence
- AI API integration (Gemini)
- Voice APIs (Web Speech API)
- Markdown rendering in React

---

## 👨‍💻 Author

**Divyansh**  
🔗 GitHub: https://github.com/Divyansh11x

---

## ⭐ Support

If you found this project helpful:

👉 Give it a ⭐ on GitHub  
👉 Share with others  

---

## 🏆 Project Status

🚧 Actively improving → New features coming soon