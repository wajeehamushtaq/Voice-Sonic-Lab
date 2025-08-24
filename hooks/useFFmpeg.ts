// /// <reference lib="dom" />
/// <reference lib="dom" />

import { useState, useEffect, useRef, useCallback } from 'react';
import type { AudioSettings } from '../types';
import { toast } from 'sonner';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export const useFFmpeg = () => {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string | null>(null);

  const ffmpegRef = useRef<any>(null); // store instance across renders
  const lastProcessedDataRef = useRef<Uint8Array | null>(null);
  const exportAfterProcessingRef = useRef<boolean>(false);

  // ✅ Load FFmpeg only once
  const load = useCallback(async () => {
    if (!ffmpegRef.current) {
      ffmpegRef.current = createFFmpeg({
        log: true,
        corePath: '/ffmpeg-core.js', // make sure it's served correctly
      });
    }

    const ffmpeg = ffmpegRef.current;

    if (!ffmpeg.isLoaded()) {
      try {
        await ffmpeg.load(); // MUST be awaited
        setIsReady(true);
      } catch (err) {
        console.error('Failed to load FFmpeg', err);
        toast.error('Failed to initialize audio engine. Please refresh the page.');
      }
    } else {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const processAudio = useCallback(
    async (audioFile: File, settings: AudioSettings, shouldExport: boolean = false) => {
      const ffmpeg = ffmpegRef.current;

      if (!ffmpeg || !ffmpeg.isLoaded()) {
        toast.error('Audio engine not ready.');
        return;
      }

      setIsProcessing(true);
      exportAfterProcessingRef.current = shouldExport;

      try {
        const inputFileName = 'input.dat';
        const outputFileName = 'output.mp3';
        const fileData = new Uint8Array(await audioFile.arrayBuffer());

        // Write file into FFmpeg FS
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(fileData.buffer));

        const { pitch, tempo, bass, mid, treble } = settings;

        // Filters
        const atempoFilter = `atempo=${tempo}`;
        const asetrateFilter = `asetrate=44100*${pitch}`;
        const bassFilter = `equalizer=f=100:width_type=h:width=100:g=${bass}`;
        const midFilter = `equalizer=f=1000:width_type=h:width=800:g=${mid}`;
        const trebleFilter = `equalizer=f=8000:width_type=h:width=4000:g=${treble}`;

        const audioFilters = [asetrateFilter, atempoFilter, bassFilter, midFilter, trebleFilter].join(',');

        // Run FFmpeg
        await ffmpeg.run('-i', inputFileName, '-af', audioFilters, outputFileName);

        // Read output
        const data = ffmpeg.FS('readFile', outputFileName);
        lastProcessedDataRef.current = data;
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
        setProcessedAudioUrl(url);

        if (exportAfterProcessingRef.current) {
          exportAudio(audioFile.name);
          exportAfterProcessingRef.current = false;
        }
      } catch (error) {
        console.error('Error processing audio:', error);
        toast.error('An error occurred during audio processing.');
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const exportAudio = useCallback((originalFileName: string) => {
    if (!lastProcessedDataRef.current) {
      toast.error('No processed audio to export. Please preview changes first.');
      return;
    }

    const blob = new Blob([lastProcessedDataRef.current.buffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = `toned_${originalFileName.split('.')[0]}.mp3`;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    toast.success('Audio exported successfully!');
  }, []);

  return { isReady, isProcessing, processedAudioUrl, processAudio, exportAudio };
};


// import { useState, useEffect, useRef, useCallback } from 'react';
// // import { FFmpeg } from '@ffmpeg/ffmpeg';
// // import { toBlobURL, fetchFile } from '@ffmpeg/util';
// import type { AudioSettings } from '../types';
// import { toast } from 'sonner';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// export const useFFmpeg = () => {
//   const [isReady, setIsReady] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processedAudioUrl, setProcessedAudioUrl] = useState<string | null>(null);
//   // const ffmpegRef = useRef<FFmpeg | null>(null);
//   const lastProcessedDataRef = useRef<Uint8Array | null>(null);
//   const exportAfterProcessingRef = useRef<boolean>(false);
//   const exportFileNameRef = useRef<string>('processed_audio.mp3');
//   const ffmpegg = createFFmpeg({
//     log: true,
//     corePath: '/ffmpeg-core.js',
//   });

//   const load = async () => {
//     // if (ffmpegRef.current) {
//     //   return;
//     // }

//     // const ffmpeg = new FFmpeg();
//     // ffmpegRef.current = ffmpeg;

//     try {
//       const teat = await ffmpegg.load();
//       console.log('test', teat)
//       setIsReady(true);
//     } catch(err) {
//         console.error("Failed to load FFmpeg", err);
//         toast.error("Failed to initialize audio engine. Please refresh the page.");
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     console.log('isready', isReady)
//   }, []);

//   const processAudio = useCallback(async (audioFile: File, settings: AudioSettings, shouldExport: boolean = false) => {
//     if (!ffmpegg || !isReady) {
//       toast.error("Audio engine not ready.");
//       return;
//     }

//     setIsProcessing(true);
//     exportAfterProcessingRef.current = shouldExport;

//     try {
//         const ffmpeg = ffmpegg;
//         const inputFileName = 'input.dat';
//         const outputFileName = 'output.mp3';
//         const fileData = new Uint8Array(await audioFile.arrayBuffer());

//         // await ffmpeg.writeFile(inputFileName, fileData);

//         ffmpeg.FS('writeFile', inputFileName, await fetchFile(fileData.buffer));

//         const { pitch, tempo, bass, mid, treble } = settings;
        
//         // Pitch and Tempo are combined in one filter for efficiency
//         const atempoFilter = `atempo=${tempo}`;
//         const asetrateFilter = `asetrate=44100*${pitch}`;

//         // EQ filters
//         const bassFilter = `equalizer=f=100:width_type=h:width=100:g=${bass}`;
//         const midFilter = `equalizer=f=1000:width_type=h:width=800:g=${mid}`;
//         const trebleFilter = `equalizer=f=8000:width_type=h:width=4000:g=${treble}`;

//         const audioFilters = [asetrateFilter, atempoFilter, bassFilter, midFilter, trebleFilter].join(',');

//         // Run ffmpeg with filters
//         await ffmpeg.run('-i', inputFileName, '-af', audioFilters, outputFileName);

//         // Read processed file back from FS
//         const data = ffmpeg.FS('readFile', outputFileName); // ✅ returns Uint8Array
//         lastProcessedDataRef.current = data;
//         const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
//         setProcessedAudioUrl(url);

//         if(exportAfterProcessingRef.current) {
//             exportAudio(audioFile.name);
//             exportAfterProcessingRef.current = false;
//         }

//     } catch (error) {
//         console.error('Error processing audio:', error);
//         toast.error('An error occurred during audio processing.');
//     } finally {
//         setIsProcessing(false);
//     }
//   }, [isReady]);


//   const exportAudio = useCallback((originalFileName: string) => {
//      if(!lastProcessedDataRef.current){
//         toast.error("No processed audio to export. Please preview changes first.");
//         return;
//      }

//      const blob = new Blob([lastProcessedDataRef.current.buffer], { type: 'audio/mpeg' });
//      const url = URL.createObjectURL(blob);
//      const a = document.createElement('a');
//      document.body.appendChild(a);
//      a.style.display = 'none';
//      a.href = url;
//      a.download = `toned_${originalFileName.split('.')[0]}.mp3`;
//      a.click();
//      URL.revokeObjectURL(url);
//      a.remove();
//      toast.success("Audio exported successfully!");

//   }, []);

//   return { isReady, isProcessing, processedAudioUrl, processAudio, exportAudio };
// };