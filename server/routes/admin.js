const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET all posts

// Dummy login (replace with real DB validation)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@example.com" && password === "admin") {
    return res.json({ success: true, token: "sample-jwt-token" });
  } else {
    return res.json({ success: false, message: "Invalid credentials" });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// CREATE a new post
router.post("/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
