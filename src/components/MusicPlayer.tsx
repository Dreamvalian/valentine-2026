"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Music, Music2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  // Automatically show the player and play music when triggered (e.g. envelope opens)
  useEffect(() => {
    if (isPlaying) {
      setShowPlayer(true);
    }
  }, [isPlaying]);

  return (
    <div className='fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4'>
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className='bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-pink-100 overflow-hidden w-[300px]'>
            <div className='flex justify-between items-center mb-2 px-2'>
              <div className='flex flex-col'>
                <span className='text-[10px] uppercase tracking-widest text-pink-400 font-bold'>
                  Now Playing
                </span>
                <span className='text-[12px] text-gray-600 font-serif'>
                  Apple Cider - beabadoobee
                </span>
              </div>
              <button
                onClick={() => setShowPlayer(false)}
                className='text-gray-400 hover:text-pink-500 p-1'>
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* YouTube Embed for Autoplay Support */}
            {/* We only render the iframe when isPlaying is true to trigger autoplay on load */}
            <div className='relative rounded-xl overflow-hidden h-[80px] bg-pink-50'>
              {isPlaying ? (
                <iframe
                  src='https://www.youtube.com/embed/laDnsiKURTQ?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=laDnsiKURTQ'
                  width='100%'
                  height='100%'
                  frameBorder='0'
                  allow='autoplay; encrypted-media'
                  className='absolute inset-0 scale-150 pointer-events-none'
                />
              ) : (
                <div className='flex items-center justify-center h-full text-pink-200'>
                  <Music2 className='w-8 h-8 animate-pulse' />
                </div>
              )}

              {/* Overlay to keep it looking clean and prevent interaction with YouTube UI */}
              <div className='absolute inset-0 bg-gradient-to-r from-pink-50/20 to-transparent pointer-events-none' />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowPlayer(!showPlayer)}
        className='p-4 rounded-full bg-white/50 backdrop-blur-sm border border-pink-100 text-pink-400 hover:bg-white transition-all duration-300 shadow-lg group'
        aria-label='Music player'>
        <div className='relative'>
          {isPlaying ? (
            <Music className='w-6 h-6 animate-pulse' />
          ) : (
            <Music2 className='w-6 h-6 opacity-60' />
          )}
          {isPlaying && (
            <span className='absolute -top-1 -right-1 flex h-3 w-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-pink-500'></span>
            </span>
          )}
        </div>
      </motion.button>
    </div>
  );
}
