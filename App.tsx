/// <reference lib="dom" />

import React, { useState, useEffect, useCallback } from 'react';
import type { AudioSettings } from './types';
import { DEFAULT_AUDIO_SETTINGS } from './constants';
import { useFFmpeg } from './hooks/useFFmpeg';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AudioControls from './components/AudioControls';
import AudioPlayer from './components/AudioPlayer';
import AiSuggestions from './components/AiSuggestions';
import ProjectActions from './components/ProjectActions';
import EmotionalPresets from './components/EmotionalPresets';
import { Toaster, toast } from 'sonner';
import './index.css'

export default function App(): React.ReactNode {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  
  const { isReady, isProcessing, processedAudioUrl, processAudio, exportAudio } = useFFmpeg();

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setOriginalAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setOriginalAudioUrl(null);
  }, [audioFile]);

  const handleFileChange = (file: File | null) => {
    if (file) {
        const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/x-m4a'];
        if (validTypes.includes(file.type)) {
            setAudioFile(file);
            setSettings(DEFAULT_AUDIO_SETTINGS);
            toast.success(`Loaded ${file.name}`);
        } else {
            toast.error('Unsupported file type. Please upload wav, mp3, m4a, or ogg.');
        }
    }
  };

  const handlePreview = useCallback(() => {
    if (audioFile && isReady) {
      toast.info('Applying new settings... this may take a moment.');
      processAudio(audioFile, settings);
    }
  }, [audioFile, isReady, processAudio, settings]);

  const handleExport = useCallback(() => {
    if(processedAudioUrl && audioFile){
        exportAudio(audioFile.name);
    } else if (audioFile) {
        toast.info('Processing audio with current settings before export.');
        processAudio(audioFile, settings, true);
    }
    else {
        toast.error('Please upload and process an audio file before exporting.');
    }
  }, [processedAudioUrl, audioFile, settings, processAudio, exportAudio]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Toaster richColors theme="dark" position="top-right" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!isReady && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
             <svg className="animate-spin h-10 w-10 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-bold">Initializing Audio Engine...</h2>
            <p className="text-gray-400 mt-2">Please wait, this may take a few seconds.</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FileUpload onFileChange={handleFileChange} disabled={!isReady} />
            <EmotionalPresets onPresetSelect={setSettings} disabled={!audioFile} />
            <AudioControls settings={settings} onSettingsChange={setSettings} onPreview={handlePreview} isProcessing={isProcessing} disabled={!audioFile} />
          </div>
          <div className="lg:col-span-3 space-y-8">
             <AudioPlayer originalUrl={originalAudioUrl} processedUrl={processedAudioUrl} isProcessing={isProcessing} />
             <AiSuggestions onApplySettings={setSettings} disabled={!audioFile} />
             <ProjectActions onExport={handleExport} disabled={!audioFile} />
          </div>
        </div>
      </main>
    </div>
  );
}