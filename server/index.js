const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const app = express();
const sharp = require('sharp');
const port = process.env.PORT || 3001;
const Post = require('./models/Post');

// Middleware
// Configure CORS to allow requests from the React development server
app.use(cors({
  origin: [
    'http://localhost:5173', // for local dev
    'https://social-media-content-analyzer-w0ho.onrender.com' // frontend deployed URL
  ],// frontend origin
  methods: ['GET','POST','PUT','DELETE'],
}));

app.use(express.json({limit:'10mb'}));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage , limits:{fileSize: 5*1024*1024}
});

// Use a custom middleware to handle Multer errors
const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File is too large. Maximum size is 5MB.' });
        }
        next(err);
    });
};

app.post('/api/upload', uploadMiddleware, async (req, res) => {
    console.log('Received upload request.');
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        let text = '';
        const fileBuffer = req.file.buffer;
        const fileMimeType = req.file.mimetype;
        const imageBase64 = fileMimeType.startsWith('image/') ? fileBuffer.toString('base64'):null;
        console.log(`Processing file with mimetype: ${fileMimeType}`);

        // Check if the file is an image or PDF
        if (fileMimeType === 'application/pdf') {
            // PDF parsing
            console.log('Parsing PDF...');
            const data = await pdf(fileBuffer);
            text = data.text;
        } else if (fileMimeType.startsWith('image/')) {
                  console.log('Preprocessing image for OCR...');

            // OCR for images
            const processedBuffer = await sharp(fileBuffer)
        .grayscale()
        .resize({ width: 500 })
        .jpeg({quality:50})
        .toBuffer();

      console.log('Running OCR on preprocessed image...');
      const result = await tesseract.recognize(processedBuffer, 'eng', {
        logger: m => console.log(m) // logs OCR progress
      });

      text = result.data.text.trim(); // ✅ Trimmed extra whitespace
    } else {
        console.error('Unsupported file type:', fileMimeType);
      return res.status(400).json({ error: 'Unsupported file type.' });
    }


        console.log('File processed successfully. Sending text to client.');
        res.json({text, imageBase64, mimeType: fileMimeType });
    } catch (err) {
        console.error('Error during file processing:', err);
        res.status(500).json({ error: `Failed to process the file: ${err.message}` });
    }
});

// // New route for AI-powered content analysis
// app.post('/analyze', async (req, res) => {
//   const { text, imageBase64, mimeType } = req.body;
//   if (!text && !imageBase64) return res.status(400).json({ error: 'No text or image provided for analysis.' });
app.post('/api/analyze', async (req, res) => {
  let { text, imageBase64,mimeType } = req.body;

  if (!text || text.trim() === '') {
    // If no text, replace with placeholder
    text = "User uploaded an image without extractable text.";
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

//   const systemPrompt = "You are an expert social media content analyst...";
//    const parts = [];
//     if (text) {
//         parts.push({ text: `Analyze the following text from a social media post:\n\n---\n${text}\n---` });
//     }
//     if (imageBase64) {
//         parts.push({
//             inlineData: {
//                 mimeType,
//                 data: imageBase64
//             }
//         });
//     }

const systemPrompt = `You are an expert social media content analyst. Analyze the provided text and image and give actionable tips to improve engagement. 

- Make your response short, fun, and friendly
- Include relevant emojis for each point
- Do NOT use any markdown symbols like **, #, or ---
- Focus on tone, clarity, call-to-action, hashtags, and visuals
- Make it ready to post on Instagram or other social media platforms `;
    
    let parts = [];
    if (text) {
        parts.push({ text: `Analyze the following text from a social media post:\n\n---\n${text}\n---` });
    }
    if (imageBase64) {
        parts.push({
            inlineData: {
                mimeType,
                data: imageBase64
            }
        });
    }

// let promptText;
//     let parts = [];

//     // Check if only an image was uploaded with no extracted text
//     if (!text && imageBase64) {
//         // Dynamic prompt to create a social media post from the image
//         promptText = "Create a short, engaging social media post based on this image. Include a catchy caption, relevant hashtags, and a call-to-action.";
//         parts.push({ text: promptText });
//         parts.push({
//             inlineData: {
//                 mimeType,
//                 data: imageBase64
//             }
//         });
//     } else {
//         // Original prompt for analysis of text and image
//         promptText = "You are an expert social media content analyst. Your task is to analyze the provided text and image and provide actionable suggestions to improve its engagement. Structure your response with a clear heading and bullet points. Focus on areas like tone, clarity, call-to-action, use of hashtags, and potential for visual elements. Keep your response concise and easy to read. You MUST ONLY respond in markdown.";
//         if (text) {
//             parts.push({ text: `Analyze the following text from a social media post:\n\n---\n${text}\n---` });
//         }
//         if (imageBase64) {
//             parts.push({
//                 inlineData: {
//                     mimeType,
//                     data: imageBase64
//                 }
//             });
//         }
//     }
//   const payload = {
//     contents: [{ parts: [{ text: userQuery }] }],
//     systemInstruction: { parts: [{ text: systemPrompt }] },
//   };

 // Combine text and image parts for a multimodal prompt
    const payload = {
        contents: [{ parts }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

  try {
  const geminiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  
        // Log the full response for debugging purposes
        // NEW CHANGE: Log the full raw response from the Gemini API to help debug issues.
        const responseText = await geminiResponse.text();
        console.log('Gemini API Raw Response:', responseText);

  if (!geminiResponse.ok) {

    throw new Error(`API call failed: ${geminiResponse.status} - ${responseText}`);
  }
  let data;
        try {
            data = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('Failed to parse Gemini API JSON response:', jsonError);
            throw new Error('Invalid JSON response from the API.');
        }

  const analysis = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!analysis || analysis.length === 0) {
            console.error('Empty or malformed analysis text from Gemini API.');
            return res.status(500).json({ error: 'Failed to analyze content: The AI returned an invalid or empty response.' });
        }

  res.json({ analysis });
} catch (error) {
  console.error('Error with Gemini API call:', error.response?.data || error.message);
  res.status(500).json({ error: 'Failed to analyze content with AI.' });
}

});

// const adminRoutes = require("./routes/admin");
// app.use("/api/admin", adminRoutes);

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// app.use("/api", require("./routes/api"));

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
