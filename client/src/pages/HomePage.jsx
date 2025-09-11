import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // import navigate

const HomePage = () => {
  const navigate = useNavigate(); // initialize navigate
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResults, setAnalysisResults] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageBase64, setImageBase64] = useState('');
  const [mimeType, setMimeType] = useState('');

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // remove token
    axios.defaults.headers.common['Authorization'] = ''; // clear axios auth header
    navigate('/login'); // redirect to login page
  };

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
    setExtractedText('');
    setError('');
    setAnalysisResults('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post("https://social-media-content-analyzer-w0ho.onrender.com/api/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { text, imageBase64: imgData, mimeType: mime } = response.data;

      setExtractedText(text || '');
      if (imgData && imgData.length < 1000000) {
        setImageBase64(imgData);
        setMimeType(mime);
      } else {
        setImageBase64('');
        setMimeType('');
      }

      await analyzeContent(text, imgData, mime);

    } catch (err) {
      setError(`Failed to fetch: ${err.message}. Please ensure the backend server is running.`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeContent = async (text, imgData, mime) => {
    setIsAnalyzing(true);
    setError('');
    setAnalysisResults('');

    try {
      const response = await axios.post('https://social-media-content-analyzer-w0ho.onrender.com/api/analyze', {
        text,
        imageBase64: imgData,
        mimeType: mime,
      });
      const analysis = response.data.analysis;

      if (!analysis) throw new Error('No analysis text found in AI response.');

      setAnalysisResults(analysis);
    } catch (err) {
      setError(`Failed to analyze content: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl relative">
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute top-0.5 right-4 sm:top-2 sm:right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition
             md:top-4 md:right-4"
        >
          Logout
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Social Media Content Analyzer</h1>
        <p className="text-center text-gray-600 mb-8">Upload a PDF or image to extract and analyze its text.</p>

        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ease-in-out cursor-pointer"
          style={{ borderColor: isDragActive ? '#4F46E5' : '#D1D5DB' }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-indigo-600 font-medium">Drop the file here...</p>
          ) : (
            <>
              <p className="text-gray-500">Drag 'n' drop a PDF or image file here, or click to select a file.</p>
              <p className="text-sm text-gray-400 mt-1">(Only .pdf, .jpg, .jpeg, .png files will be accepted)</p>
            </>
          )}
        </div>

        {file && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 font-medium">
              Selected file: <span className="font-normal text-gray-600">{file.name}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading || isAnalyzing}
          className="mt-6 w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#4F46E5' }}
        >
          {(loading || isAnalyzing) ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Upload and Analyze'
          )}
        </button>

        {extractedText && (
          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Extracted Text:</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed">
              {extractedText}
            </div>
          </div>
        )}

        {analysisResults && (
          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">AI Analysis and Suggestions:</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed">
              {analysisResults}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;


// import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';

// const HomePage = () => {
//   const [file, setFile] = useState(null);
//   const [extractedText, setExtractedText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [analysisResults, setAnalysisResults] = useState('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [imageBase64, setImageBase64] = useState('');
//   const [mimeType, setMimeType] = useState('');

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
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const { text, imageBase64: imgData, mimeType: mime } = response.data;

//       setExtractedText(text || '');
//       if (imgData && imgData.length < 1000000) {
//         setImageBase64(imgData);
//         setMimeType(mime);
//       } else {
//         setImageBase64('');
//         setMimeType('');
//       }

//       await analyzeContent(text, imgData, mime);

//     } catch (err) {
//       setError(`Failed to fetch: ${err.message}. Please ensure the backend server is running.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeContent = async (text, imgData, mime) => {
//     setIsAnalyzing(true);
//     setError('');
//     setAnalysisResults('');

//     try {
//       const response = await axios.post('http://localhost:5000/analyze', {
//         text,
//         imageBase64: imgData,
//         mimeType: mime,
//       });
//       const analysis = response.data.analysis;

//       if (!analysis) throw new Error('No analysis text found in AI response.');

//       setAnalysisResults(analysis);
//     } catch (err) {
//       setError(`Failed to analyze content: ${err.message}`);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

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
//           style={{ backgroundColor: '#4F46E5' }}
//         >
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

// export default HomePage;
