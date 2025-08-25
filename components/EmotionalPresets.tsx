import React from 'react';
import type { AudioSettings, EmotionalPreset } from '../types';
import { EMOTIONAL_PRESETS } from '../constants';

interface EmotionalPresetsProps {
  onPresetSelect: (settings: AudioSettings) => void;
  disabled: boolean;
}

const presetConfigs = [
  { key: 'happy' as EmotionalPreset, label: 'Happy', emoji: '😊', color: 'bg-yellow-500' },
  { key: 'sad' as EmotionalPreset, label: 'Sad', emoji: '😢', color: 'bg-blue-500' },
  { key: 'energetic' as EmotionalPreset, label: 'Energetic', emoji: '⚡', color: 'bg-orange-500' },
  { key: 'calm' as EmotionalPreset, label: 'Calm', emoji: '🧘', color: 'bg-green-500' },
  { key: 'mysterious' as EmotionalPreset, label: 'Mysterious', emoji: '🔮', color: 'bg-purple-500' },
  { key: 'intimate' as EmotionalPreset, label: 'Intimate', emoji: '💕', color: 'bg-pink-500' },
  { key: 'epic' as EmotionalPreset, label: 'Epic', emoji: '🏛️', color: 'bg-red-500' },
  { key: 'dreamy' as EmotionalPreset, label: 'Dreamy', emoji: '💫', color: 'bg-indigo-500' },
  { key: 'aggressive' as EmotionalPreset, label: 'Aggressive', emoji: '🔥', color: 'bg-red-600' },
  { key: 'romantic' as EmotionalPreset, label: 'Romantic', emoji: '🌹', color: 'bg-rose-500' },
];

export default function EmotionalPresets({ onPresetSelect, disabled }: EmotionalPresetsProps): React.ReactNode {
  const handlePresetClick = (presetKey: EmotionalPreset) => {
    const preset = EMOTIONAL_PRESETS[presetKey];
    if (preset) {
      onPresetSelect(preset);
    }
  };

  return (
    <div className={`p-6 bg-gray-800 rounded-xl border border-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <h2 className="text-xl font-bold text-white mb-4">Emotional Presets</h2>
      <p className="text-gray-400 text-sm mb-6">
        Transform your audio's emotional impact with one click
      </p>
      
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${disabled ? 'pointer-events-none' : ''}`}>
        {presetConfigs.map(({ key, label, emoji, color }) => (
          <button
            key={key}
            onClick={() => handlePresetClick(key)}
            disabled={disabled}
            className={`
              flex flex-col items-center p-4 rounded-lg border border-gray-600 
              bg-gray-700 hover:bg-gray-600 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            `}
          >
            <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform duration-200`}>
              {emoji}
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">How it works:</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <strong>Happy:</strong> Higher pitch, faster tempo, bright EQ</li>
          <li>• <strong>Sad:</strong> Lower pitch, slower tempo, dark EQ, long reverb</li>
          <li>• <strong>Energetic:</strong> Fast tempo, punchy compression, bright EQ</li>
          <li>• <strong>Calm:</strong> Slower tempo, warm EQ, gentle reverb</li>
          <li>• <strong>Mysterious:</strong> Dark EQ, long reverb, delay effects</li>
        </ul>
      </div>
    </div>
  );
}
