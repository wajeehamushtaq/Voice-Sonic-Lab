/// <reference lib="dom" />

import React, { useState } from 'react';
import type { AudioSettings } from '../types';
import { DEFAULT_AUDIO_SETTINGS } from '../constants';
import { Spinner } from './Spinner';

interface AudioControlsProps {
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  onPreview: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

const ControlSlider = ({ label, value, min, max, step, onChange, unit = '' }: { label: string; value: number; min: number; max: number; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, unit?: string }): React.ReactNode => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="font-medium text-gray-300">{label}</label>
      <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded-md text-purple-300">{value.toFixed(2)}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110"
    />
  </div>
);

export default function AudioControls({ settings, onSettingsChange, onPreview, isProcessing, disabled }: AudioControlsProps): React.ReactNode {
  
  const handleChange = (key: keyof AudioSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, [key]: parseFloat(e.target.value) });
  };
  
  const handleReset = () => {
    onSettingsChange(DEFAULT_AUDIO_SETTINGS);
  };
  
  return (
    <div className={`p-6 bg-gray-800 rounded-xl border border-gray-700 space-y-6 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <h2 className="text-xl font-bold text-white">Audio Controls</h2>
      <div className={`space-y-6 ${disabled ? 'pointer-events-none' : ''}`}>
        <ControlSlider label="Pitch" value={settings.pitch} min={0.5} max={2.0} step={0.01} onChange={handleChange('pitch')} unit="x" />
        <ControlSlider label="Tempo" value={settings.tempo} min={0.5} max={2.0} step={0.01} onChange={handleChange('tempo')} unit="x" />
        <ControlSlider label="Bass" value={settings.bass} min={-20} max={20} step={1} onChange={handleChange('bass')} unit=" dB" />
        <ControlSlider label="Mid" value={settings.mid} min={-20} max={20} step={1} onChange={handleChange('mid')} unit=" dB" />
        <ControlSlider label="Treble" value={settings.treble} min={-20} max={20} step={1} onChange={handleChange('treble')} unit=" dB" />
      </div>
      <div className="flex space-x-4 pt-4 border-t border-gray-700">
        <button
          onClick={onPreview}
          disabled={disabled || isProcessing}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isProcessing ? <Spinner /> : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
          <span>{isProcessing ? 'Processing...' : 'Preview Changes'}</span>
        </button>
        <button
          onClick={handleReset}
          disabled={disabled || isProcessing}
          className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}