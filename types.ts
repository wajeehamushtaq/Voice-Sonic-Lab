
export interface AudioSettings {
  pitch: number;
  tempo: number;
  bass: number;
  mid: number;
  treble: number;
  // Emotional audio settings
  reverb: {
    wet: number;          // 0 to 1 (dry/wet mix)
    decay: number;        // 0.1 to 10 seconds
    preDelay: number;     // 0 to 100 ms
    roomSize: number;     // 0 to 1
  };
  compression: {
    threshold: number;    // -60 to 0 dB
    ratio: number;        // 1:1 to 20:1
    attack: number;       // 0.1 to 100 ms
    release: number;      // 10 to 1000 ms
  };
  delay: {
    time: number;         // 0 to 2000 ms
    feedback: number;     // 0 to 0.9
    mix: number;          // 0 to 1
  };
  filter: {
    type: 'lowpass' | 'highpass' | 'bandpass' | 'none';
    frequency: number;    // 20 to 20000 Hz
    q: number;           // 0.1 to 10 (resonance)
  };
  stereo: {
    width: number;        // 0 to 2 (mono to wide stereo)
    balance: number;      // -1 to 1 (left to right)
  };
}

export type EmotionalPreset = 
  | 'happy' 
  | 'sad' 
  | 'energetic' 
  | 'calm' 
  | 'mysterious' 
  | 'intimate' 
  | 'epic' 
  | 'dreamy' 
  | 'aggressive' 
  | 'romantic';