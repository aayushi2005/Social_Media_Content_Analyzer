const express = require("express");
const router = express.Router();

// Test login details
const TEST_EMAIL = "admin@example.com";
const TEST_PASSWORD = "admin";
const TEST_TOKEN = "test-admin-token";

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === TEST_EMAIL && password === TEST_PASSWORD) {
    return res.json({ success: true, token: TEST_TOKEN });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;
