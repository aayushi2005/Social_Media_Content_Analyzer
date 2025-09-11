// const express = require("express");
// const multer = require("multer");
// const Post = require("../models/Post");

// const router = express.Router();
// const upload = multer();

// // ---------------- LOGIN ----------------
// const TEST_EMAIL = "admin@example.com";
// const TEST_PASSWORD = "admin";
// const TEST_TOKEN = "test-admin-token";

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (email === TEST_EMAIL && password === TEST_PASSWORD) {
//     return res.json({ success: true, token: TEST_TOKEN });
//   } else {
//     return res.status(401).json({ success: false, message: "Invalid credentials" });
//   }
// });

// // ---------------- FILE UPLOAD ----------------
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Dummy extraction (replace with actual OCR/text extraction logic later)
//     const extractedText = `Extracted text from ${req.file.originalname}`;
//     const imageBase64 = req.file.buffer.toString("base64");

//     res.json({
//       text: extractedText,
//       imageBase64,
//       mimeType: req.file.mimetype,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "File processing failed" });
//   }
// });

// // ---------------- CONTENT ANALYSIS ----------------
// router.post("/analyze", (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: "No text provided" });
//     }

//     // Dummy AI analysis
//     const analysis = `AI Analysis Result: The uploaded content is safe and professional.\n\nSummary: ${text}`;

//     res.json({ analysis });
//   } catch (err) {
//     console.error("Analyze error:", err);
//     res.status(500).json({ error: "Content analysis failed" });
//   }
// });

// // ---------------- POSTS CRUD ----------------
// router.get("/posts", async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     console.error("Error fetching posts:", err);
//     res.status(500).json({ error: "Failed to fetch posts" });
//   }
// });

// router.post("/posts", async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const newPost = new Post({ title, content });
//     await newPost.save();
//     res.json(newPost);
//   } catch (err) {
//     console.error("Error creating post:", err);
//     res.status(500).json({ error: "Failed to create post" });
//   }
// });

// module.exports = router;
