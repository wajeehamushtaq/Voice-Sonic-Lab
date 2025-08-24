
import React, { useState } from 'react';

const UserIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SoundWaveIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-3 3m6 0v13l3-3M5 10h14" />
    </svg>
);


export default function Header(): React.ReactNode {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Mock authentication logic
    const handleAuthClick = () => {
        setIsAuthenticated(!isAuthenticated);
    };
    
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <SoundWaveIcon />
                    <h1 className="text-2xl font-bold text-white tracking-tight">Audio Tone <span className="text-purple-400">Master</span></h1>
                </div>
                <div className="flex items-center space-x-4">
                     <button
                        onClick={handleAuthClick}
                        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                       <UserIcon/>
                       <span>{isAuthenticated ? 'Sign Out' : 'Sign In'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
