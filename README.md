# 💘 Dating Profile Description Generator (Frontend)

A sleek, responsive frontend built with **Next.js** that allows users to generate fun, engaging dating profile descriptions using AI, based on uploaded photos and optional personal input.

### 🌐 Demo

**Live URL**: [https://dnd-generator-frontend.vercel.app/](https://dnd-generator-frontend.vercel.app/)

---

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/) – React framework for server-side rendering
- [TailwindCSS](https://tailwindcss.com/) – Utility-first CSS for fast UI development
- [Heroicons](https://heroicons.com/) – Beautiful icons by Tailwind Labs
- [DND-Kit](https://dndkit.com/) - A lightweight, performant, accessible and
  extensible drag & drop toolkit for React.

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/greedchikara/DND-Generator-Frontend
cd DND-Generator-Frontend
```

### 2. Create Environment Variables

Create a `.env.local` file in the root with the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Replace the value with your deployed or local backend API URL.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Local Development

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000)

---

## 🎯 Features

- Upload 1 to 4 photos (required)
- Answer up to 3 optional personal questions
- Drag-and-drop image reordering
- Realtime image preview using `URL.createObjectURL`
- Generate dating profile descriptions using AI
- Displays editable, copyable result
- Toast notifications for success and error states
- Responsive mobile-first design

---

## 🖼️ Photo Upload & Display Logic

- Users must upload **at least 1** and **up to 4** photos.
- Uploaded photos are held in state (`photos`).
- The **"Generate Description"** button remains disabled until a photo is uploaded.
- For display and rearrangement, images are previewed using `URL.createObjectURL(file)`.

### 📤 Upload Workflow

1. Once the user selects photos and optionally answers the questions:
2. The frontend:
   - Uploads each photo as a **1MB chunk** (due to Vercel’s 4.5MB per upload limit).
   - Collects the returned **photo URLs** from the backend.
3. It then makes a **second API request** to generate the description, passing:
   - The list of photo URLs
   - The optional text responses

---

## 📂 Project Structure (Frontend)

```
/app
  page.tsx
/components
  PhotoUploader.tsx
  DescriptionDisplay.tsx
  Questionnare.tsx
  SortablePhoto.tsx
  LoadingOverlay.tsx
/styles
  globals.css     # Tailwind setup
```

---

## 📌 Notes

- Works best when deployed alongside a FastAPI backend that:
  - Handles file chunking and storage
  - Generates descriptions using an AI provider like OpenAI
- This project is fully compatible with deployment on [Vercel](https://vercel.com/)

---

## 🧑‍💻 Author

Made with 💘 by Akash Negi
