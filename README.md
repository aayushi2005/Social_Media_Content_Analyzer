<!-- Social Media Content Analyzer
The Social Media Content Analyzer is a web application designed to analyze social media posts (in the form of PDFs and images) and provide data-driven suggestions to improve engagement. It is built as a full-stack application with a React frontend and a Node.js backend.
Live Link-: https://social-media-content-analyzer-frontend-xky7.onrender.com
Features
Document Upload: Users can upload PDF and image files using a drag-and-drop interface.

Text Extraction: The application performs the following:

PDF Parsing: Extracts text from PDF files.

OCR (Optical Character Recognition): Extracts text from image files (JPG, PNG) using Tesseract.js.

AI-Powered Analysis: The extracted text and/or the image itself are sent to the Gemini API, which provides a detailed analysis and suggestions for improving social media post engagement.

User Interface: A clean and responsive user interface built with React and Tailwind CSS.

Technical Stack
Frontend:

React: A JavaScript library for building the user interface.

Axios: A library for making HTTP requests to the backend.

React Dropzone: A simple component for handling file uploads.

Tailwind CSS: A utility-first CSS framework for styling.

Backend:

Node.js: The JavaScript runtime environment.

Express.js: A fast, minimalist web framework for Node.js.

CORS: Middleware for handling Cross-Origin Resource Sharing.

Multer: A Node.js middleware for handling multipart/form-data.

PDF-Parse: A library to extract text from PDFs.

Tesseract.js: A pure JavaScript OCR library for images.

AI Service:

Gemini API: Used for AI-powered content analysis.

Setup Instructions
Follow these steps to set up and run the project locally.

1. Backend Setup
Navigate to the backend directory:

cd backend

Install the backend dependencies:

npm install

Create a .env file in the backend directory and add your Gemini API key:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

You can get a free API key from Google AI Studio.

Start the backend server:

node server.js

The server will run on http://localhost:5000.

2. Frontend Setup
Navigate to the project's root directory:

cd ..

Install the frontend dependencies:

npm install

Change the API base URL in the src/App.jsx file to your backend's deployed URL. The current code points to https://social-media-content-analyzer-w0ho.onrender.com. If you are running locally, you must change this to http://localhost:5000.

Start the frontend application:

npm start

The application will run on http://localhost:3000 (or another available port).

Usage
Open the application in your browser.

Click "Login to Continue" to access the main page.

Drag and drop a PDF or image file into the designated area or click to select a file.

Click "Upload and Analyze."

Wait for the application to extract the text and an AI-powered analysis to appear on the screen. -->
# ⭐ Social Media Content Analyzer

The **Social Media Content Analyzer** is a full-stack web application that analyzes social media posts (PDFs and images) and provides **AI-powered, data-driven suggestions** to improve engagement.

Built with a **React + Tailwind CSS frontend** and a **Node.js + Express backend**, it combines **OCR and AI** to deliver powerful insights.
Live Link-: https://social-media-content-analyzer-frontend-xky7.onrender.com
---

## ✨ Features

- **📂 Upload** PDF and image files with a drag-and-drop interface
- **📑 Text Extraction** using PDF-Parse
- **🖼 OCR for Images** (JPG, PNG) with Tesseract.js
- **🤖 AI-Powered Analysis** via Gemini API for engagement suggestions
- **🎨 Modern UI** with React + Tailwind CSS

---

## 🛠 Tech Stack

### 🔹 Frontend
- ⚛ React
- 🌐 Axios
- 📤 React Dropzone
- 🎨 Tailwind CSS

### 🔹 Backend
- 🟢 Node.js
- 🚀 Express.js
- 🔗 CORS
- 📥 Multer
- 📑 PDF-Parse
- 🔎 Tesseract.js

### 🔹 AI Service
- 🤖 Gemini API

---

## ⚙️ Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the backend directory and add your Gemini API key:
```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
Start the backend server:
```bash
node server.js
```
The server will run on [http://localhost:5000](http://localhost:5000).

### 2. Frontend Setup
```bash
cd ..
npm install
```
Change the API base URL in `src/App.jsx` to your backend's deployed URL. If running locally, use `http://localhost:5000`.

Start the frontend application:
```bash
npm start
```
The app will run on [http://localhost:3000](http://localhost:3000).

---

## 🚀 Usage

1. Open the application in your browser.
2. Click **Login to Continue** to access the main page.
3. Drag and drop a PDF or image file, or click to select a file.
4. Click **Upload and Analyze**.
5. Wait for the extracted text and AI-powered analysis to appear.

---
