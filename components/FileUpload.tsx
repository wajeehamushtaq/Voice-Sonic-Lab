/// <reference lib="dom" />

import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  disabled: boolean;
}

const UploadIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H13.5a4 4 0 014 4v1.586a1 1 0 01-.293.707l-1.414 1.414a1 1 0 00-.293.707V16m-7-3h4" />
    </svg>
);

export default function FileUpload({ onFileChange, disabled }: FileUploadProps): React.ReactNode {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [onFileChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className={`p-6 bg-gray-800 rounded-xl border-2 border-dashed ${isDragging ? 'border-purple-500 bg-gray-700' : 'border-gray-600'} transition-colors duration-200 ${disabled ? 'opacity-50' : ''}`}>
      <div 
        className="w-full h-full flex flex-col items-center justify-center text-center"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <UploadIcon />
        <p className="mt-4 text-lg font-semibold">Drag & Drop Audio File</p>
        <p className="text-sm text-gray-400">or click to browse</p>
        <p className="text-xs text-gray-500 mt-1">WAV, MP3, M4A, OGG</p>
        <input 
          type="file" 
          id="audio-upload"
          className="hidden" 
          accept="audio/wav,audio/mpeg,audio/mp4,audio/ogg,audio/x-m4a"
          onChange={handleChange}
          disabled={disabled}
        />
        <label htmlFor="audio-upload" className={`mt-4 cursor-pointer inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${disabled ? 'cursor-not-allowed' : ''}`}>
          Select File
        </label>
      </div>
    </div>
  );
}