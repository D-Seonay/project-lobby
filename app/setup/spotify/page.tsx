'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Terminal, Command, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function SpotifySetupContent() {
  const searchParams = useSearchParams();
  const refreshToken = searchParams.get('refresh_token');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (refreshToken) {
      navigator.clipboard.writeText(refreshToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startAuthSequence = () => {
    window.location.href = '/api/spotify/login';
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-fafafa flex flex-col items-center justify-center p-6 font-mono">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="space-y-2 border-l-2 border-zinc-800 pl-6">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">
            Spotify<span className="text-zinc-500 opacity-40">_</span>Setup
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
            Internal Token Generation Utility // v2.0
          </p>
        </div>

        {!refreshToken ? (
          <div className="space-y-6">
            <p className="text-sm text-zinc-400 leading-relaxed">
              This utility will generate a persistent <span className="text-white">REFRESH_TOKEN</span> for the Spotify API. 
              Ensure your <span className="text-white">SPOTIFY_CLIENT_ID</span> and <span className="text-white">SPOTIFY_CLIENT_SECRET</span> are already configured in your environment.
            </p>
            
            <button
              onClick={startAuthSequence}
              className="group flex items-center gap-3 px-6 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
              <Command className="w-4 h-4" />
              START_AUTH_SEQUENCE
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Generated Refresh Token</label>
              <div className="relative group">
                <div className="w-full bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg font-mono text-xs break-all text-zinc-300 leading-relaxed">
                  {refreshToken}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/30 border-l-2 border-white space-y-4">
              <div className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest font-bold">
                <Terminal className="w-3 h-3" />
                Next Steps
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                1. Copy the token above.<br />
                2. Open your <span className="text-zinc-200">.env.local</span> file.<br />
                3. Paste it into <span className="text-zinc-200">SPOTIFY_REFRESH_TOKEN</span>.<br />
                4. Restart your development server.
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              ← Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default function SpotifySetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
        Initializing_Sequence...
      </div>
    }>
      <SpotifySetupContent />
    </Suspense>
  );
}
