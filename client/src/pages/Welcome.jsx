import React from 'react';
import { useNavigate } from 'react-router-dom';

// const Welcome = ({ onLogin }) => {
//     const handleLogin = () => {
//         onLogin(true);
//     };

const Welcome = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login'); // redirects to your Login page route
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                    Welcome to Social Media Content Analyzer
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Analyze your posts and get actionable insights to improve engagement.
                </p>
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Login to Continue
                </button>
            </div>
        </div>
    );
};

export default Welcome;
