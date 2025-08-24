
import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface AudioPlayerProps {
  originalUrl: string | null;
  processedUrl: string | null;
  isProcessing: boolean;
}

const Player = ({ url, title, placeholder }: { url: string | null; title: string; placeholder: string }): React.ReactNode => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h3 className="font-semibold text-gray-300 mb-2">{title}</h3>
    {url ? (
      <audio controls src={url} className="w-full">
        Your browser does not support the audio element.
      </audio>
    ) : (
      <div className="h-14 flex items-center justify-center text-gray-500 text-sm">
        {placeholder}
      </div>
    )}
  </div>
);


export default function AudioPlayer({ originalUrl, processedUrl, isProcessing }: AudioPlayerProps): React.ReactNode {
  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 space-y-4">
      <h2 className="text-xl font-bold text-white">Audio Preview</h2>
      <Player url={originalUrl} title="Original" placeholder="Upload a file to listen" />
      <div className="relative">
        <Player url={processedUrl} title="Processed Preview" placeholder="Process audio to listen" />
        {isProcessing && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
            <Spinner />
            <p className="mt-2 text-gray-300">Generating preview...</p>
          </div>
        )}
      </div>
    </div>
  );
}
