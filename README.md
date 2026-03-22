# 🤖 AI Chatbot (Next.js + MongoDB)

A full-stack AI chatbot application built using **Next.js 16**, **MongoDB**, and modern React features.
It supports real-time chat interaction with a clean UI and persistent chat history.

---

## 🚀 Features

* 💬 Real-time chat interface
* ⚡ Fast UI with Next.js (App Router)
* 🧠 AI-powered responses
* 💾 Chat history stored in MongoDB
* ✨ Typing animation effect
* 🎨 Clean and responsive UI

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** MongoDB (Mongoose)
* **Language:** TypeScript

---

## 📂 Project Structure

```
ai-chatbot/
│── app/
│   ├── api/
│   │   ├── chat/
│   │   └── history/
│   ├── page.tsx
│
│── components/
│   └── ChatBox.tsx
│
│── lib/
│   └── mongodb.ts
│
│── models/
│   └── Chat.ts
│
│── .env.local
│── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/Divyansh11x/ai-chatbot.git
cd ai-chatbot
```

---

### 2️⃣ Install dependencies

```
npm install
```

---

### 3️⃣ Setup environment variables

Create a file:

```
.env.local
```

Add:

```
MONGODB_URI=your_mongodb_connection_string
```

---

### 4️⃣ Run the project

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## ⚠️ Known Issues

* MongoDB authentication error if credentials are incorrect
* Ensure network access is enabled in MongoDB Atlas

---

## 📈 Future Improvements

* 🔐 User authentication
* 🌐 Deployment (Vercel)
* 📊 Chat analytics
* 🤖 Streaming AI responses

---

## 👨‍💻 Author

**Divyansh**
GitHub: https://github.com/Divyansh11x

---

## ⭐ Show your support

If you like this project, give it a ⭐ on GitHub!
