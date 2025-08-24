/// <reference lib="dom" />

import React, { useState } from 'react';
import type { AudioSettings } from '../types';
import { getAudioSuggestions } from '../services/geminiService';
import { toast } from 'sonner';
import { Spinner } from './Spinner';

interface AiSuggestionsProps {
  onApplySettings: (settings: AudioSettings) => void;
  disabled: boolean;
}

const WandIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.069l1.97.487a1 1 0 01.73.976v1.139a1 1 0 01-.293.707l-3.232 3.232a1 1 0 01-.707.293h-1.414a1 1 0 01-.707-.293L6.793 6.672a1 1 0 01-.293-.707V4.826a1 1 0 01.73-.976L9 3.069V2a1 1 0 01.7-1.247l.5-.207a1 1 0 011.1 0l.5.207zM12 10.5a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export default function AiSuggestions({ onApplySettings, disabled }: AiSuggestionsProps): React.ReactNode {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!prompt) {
      toast.error('Please describe the desired audio style.');
      return;
    }
    setIsLoading(true);
    toast.info('AI is thinking... crafting the perfect sound.');
    try {
      const suggestedSettings = await getAudioSuggestions(prompt);
      if (suggestedSettings) {
        onApplySettings(suggestedSettings);
        toast.success('AI suggestions applied! Press "Preview Changes".');
      } else {
         toast.error('AI could not generate settings. Please try a different prompt.');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('An error occurred while fetching AI suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 bg-gray-800 rounded-xl border border-gray-700 space-y-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <h2 className="text-xl font-bold text-white flex items-center space-x-2">
        <WandIcon />
        <span>AI Suggestions</span>
      </h2>
      <div className={`space-y-4 ${disabled ? 'pointer-events-none' : ''}`}>
        <p className="text-sm text-gray-400">Describe the sound you want, and let AI suggest the settings.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Clear podcast voice', 'Epic cinematic trailer', 'Lo-fi chill beat'"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          rows={3}
          disabled={isLoading || disabled}
        />
        <button
          onClick={handleGetSuggestions}
          disabled={isLoading || disabled}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? <Spinner /> : <WandIcon />}
          <span>{isLoading ? 'Generating...' : 'Get Suggestions'}</span>
        </button>
      </div>
    </div>
  );
}