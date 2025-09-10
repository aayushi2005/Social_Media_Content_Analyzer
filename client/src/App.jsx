import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import Login from './components/Login';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = localStorage.getItem('token'); // check if user is logged in
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<HomePage />} />          {/* Public landing page */}
        <Route path="/login" element={<Login />} />        {/* Login page */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />                                {/* Protected admin page */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


// import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';

// const App = () => {
//   const [file, setFile] = useState(null);
//   const [extractedText, setExtractedText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [analysisResults, setAnalysisResults] = useState('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [imageBase64, setImageBase64] = useState('');
// const [mimeType, setMimeType] = useState('');


//   const onDrop = useCallback(acceptedFiles => {
//     setFile(acceptedFiles[0]);
//     setExtractedText('');
//     setError('');

//     setAnalysisResults('');
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': ['.pdf'],
//       'image/jpeg': ['.jpeg', '.jpg'],
//       'image/png': ['.png'],
//     },
//     multiple: false
//   });

//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5000/upload', formData, {
//   headers: { 'Content-Type': 'multipart/form-data' },
// });

// // setExtractedText(response.data.text); // ✔ directly access data
// // await analyzeContent(response.data.text,data.imageBase64, data.mimeType);
// const { text, imageBase64: imgData, mimeType: mime } = response.data;

//       setExtractedText(text || '');
//        // Only set image if it exists and is small to avoid 413 error
//       if (imgData && imgData.length < 1000000) { // ~1MB limit
//         setImageBase64(imgData);
//         setMimeType(mime);
//       } else {
//         setImageBase64('');
//         setMimeType('');
//       }

//       // Call AI analysis with both text and image (if any)
//       await analyzeContent(text, imgData, mime);

//     } catch (err) {
//       setError(`Failed to fetch: ${err.message}. Please ensure the backend server is running.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // New function to handle the AI analysis request to the backend
//   const analyzeContent = async (text,imgData,mime) => {
//   setIsAnalyzing(true);
//   setError('');
//   setAnalysisResults('');

//   try {
//     const response = await axios.post('http://localhost:5000/analyze', { text,
//         imageBase64: imgData,
//         mimeType: mime, });
//     const analysis = response.data.analysis;

//     if (!analysis) throw new Error('No analysis text found in AI response.');

//     setAnalysisResults(analysis);
//   } catch (err) {
//     setError(`Failed to analyze content: ${err.message}`);
//   } finally {
//     setIsAnalyzing(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center font-sans">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Social Media Content Analyzer</h1>
//         <p className="text-center text-gray-600 mb-8">Upload a PDF or image to extract and analyze its text.</p>

//         <div
//           {...getRootProps()}
//           className="border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ease-in-out cursor-pointer"
//           style={{ borderColor: isDragActive ? '#4F46E5' : '#D1D5DB' }}
//         >
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p className="text-indigo-600 font-medium">Drop the file here...</p>
//           ) : (
//             <>
//               <p className="text-gray-500">Drag 'n' drop a PDF or image file here, or click to select a file.</p>
//               <p className="text-sm text-gray-400 mt-1">(Only .pdf, .jpg, .jpeg, .png files will be accepted)</p>
//             </>
//           )}
//         </div>

//         {file && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <p className="text-gray-700 font-medium">
//               Selected file: <span className="font-normal text-gray-600">{file.name}</span>
//             </p>
//           </div>
//         )}

//         {error && (
//           <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
//             <p className="font-medium">Error:</p>
//             <p>{error}</p>
//           </div>
//         )}

//         <button
//           onClick={handleUpload}
//           disabled={!file || loading || isAnalyzing}
//           className="mt-6 w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
//           // Updated: Button style changes based on both loading and analyzing states
//           style={{ backgroundColor: (loading || isAnalyzing) ? '#4F46E5' : '#4F46E5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
//         >
//           {/* Updated: Button text and spinner change based on both loading and analyzing states */}
//           {(loading || isAnalyzing) ? (
//             <div className="flex items-center justify-center">
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               <span className="ml-2">Processing...</span>
//             </div>
//           ) : (
//             'Upload and Analyze'
//           )}
//         </button>

//         {extractedText && (
//           <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//             <h3 className="text-lg font-bold text-gray-800 mb-2">Extracted Text:</h3>
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed">
//               {extractedText}
//             </div>
//           </div>
//         )}

//         {/* New section to display the AI analysis results */}
//         {analysisResults && (
//           <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//             <h3 className="text-lg font-bold text-gray-800 mb-2">AI Analysis and Suggestions:</h3>
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed">
//               {analysisResults}
//             </div>
//           </div>
//         )}
        
//       </div>
//     </div>
//   );
// };

// export default App;
