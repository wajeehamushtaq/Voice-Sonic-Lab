## Audio Tone Master

Audio Tone Master is a Vite + React application for transforming the feel and emotion of audio in the browser using WebAssembly FFmpeg. It provides intuitive controls (pitch, tempo, EQ) and one‑click emotional presets (happy, sad, energetic, calm, mysterious, intimate, epic, dreamy, aggressive, romantic). You can preview and export processed audio as MP3 locally without a server.

### Key Features
- Pitch, tempo, and 3‑band EQ (bass/mid/treble)
- Emotional presets for instant mood changes
- Client‑side processing via FFmpeg WASM (no uploads required)
- Live preview and MP3 export
- Tailwind CSS styling (built via PostCSS, no CDN)

### Tech Stack
- React 18, TypeScript, Vite
- Tailwind CSS + PostCSS + Autoprefixer
- FFmpeg WASM (`@ffmpeg/ffmpeg` + core assets)
- Optional: Google Gemini for AI suggestions


## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install
```
npm install
```

### Development
```
npm run dev
```
Then open `http://localhost:5173`.

SharedArrayBuffer is required by FFmpeg. The dev server is configured to send:
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Embedder-Policy: require-corp


## Build
```
npm run build
```
Output goes to `dist/`.

### Preview build
```
npm run preview
```


## Project Structure
```
audio-tone-master/
  App.tsx                  // App layout and composition
  components/              // UI components (controls, player, presets, etc.)
  hooks/useFFmpeg.ts       // FFmpeg loading, processing and export logic
  services/geminiService.ts// Optional AI suggestions (Gemini)
  public/                  // FFmpeg core assets served from same origin
    ffmpeg-core.js
    ffmpeg-core.wasm
    ffmpeg-core.worker.js
  index.html               // Vite entry (no CDN Tailwind)
  index.tsx                // React bootstrap
  index.css                // Tailwind entry (@tailwind directives)
  tailwind.config.js       // Tailwind content scanning config
  postcss.config.js        // Tailwind + Autoprefixer
  vite.config.ts           // COOP/COEP headers for dev, aliases
  tsconfig.json            // TypeScript settings
```


## Environment Variables (Optional, for AI)
If you want AI‑powered suggestions, set your Gemini API key:

- Locally: create `.env` with:
```
VITE_GEMINI_API_KEY=your_key_here
```
- Vercel: add a Project Environment Variable named `VITE_GEMINI_API_KEY`.

The app reads `import.meta.env.VITE_GEMINI_API_KEY` (and falls back to `GEMINI_API_KEY`/`API_KEY`).


## Tailwind CSS (No CDN)
Tailwind is compiled via PostCSS during dev/build.
- `index.css` contains `@tailwind base; @tailwind components; @tailwind utilities;`
- `tailwind.config.js` content paths include `components/`, `hooks/`, `services/`, `App.tsx`, `index.tsx`.


## FFmpeg WASM Notes
- The FFmpeg core files must be served from your origin under `/public`:
  - `public/ffmpeg-core.js`
  - `public/ffmpeg-core.wasm`
  - `public/ffmpeg-core.worker.js`
- The hook initializes FFmpeg with:
  - `corePath: '/ffmpeg-core.js'`


## Deployment (Vercel)
FFmpeg needs cross‑origin isolation (SharedArrayBuffer). Add the headers below so your app runs in production:

`vercel.json` (already included):
```
{
  "headers": [
    {
      "source": "(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}
```

Also ensure any third‑party assets are not imported cross‑origin at runtime. The app avoids import maps and fetches all critical assets from your domain.


## Troubleshooting
- Build error: "Cannot find type definition file for 'node'"
  - We removed Node types from `tsconfig.json`. If you need them, add `@types/node` to devDependencies and set `types: ["node", "vite/client"]`.

- Runtime: "SharedArrayBuffer is not defined"
  - Ensure COOP/COEP headers are present (see `vercel.json`) and you are not loading modules/assets cross‑origin.

- Type error creating Blob from FFmpeg output
  - The app clones `Uint8Array` into an `ArrayBuffer` before Blob creation to satisfy TS in strict environments.

- Tailwind not applying
  - Verify `postcss.config.js` exists and `tailwind.config.js` content paths match your files. Restart the dev server after changes.


## Scripts
- `npm run dev`    – start Vite dev server
- `npm run build`  – typecheck and build production assets
- `npm run preview`– preview built app


## License
MIT
