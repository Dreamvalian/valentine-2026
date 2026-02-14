"use client";

import Background from "@/components/Background";
import Envelope, { EnvelopeTheme } from "@/components/Envelope";
import { EMOTIONAL_LETTERS } from "@/lib/content";
import { AnimatePresence, motion } from "framer-motion";
import {
  CloudRain,
  Coffee,
  Flame,
  Heart,
  Megaphone,
  Moon,
  Smile,
  Star,
  Stars,
  Sun,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), {
  ssr: false,
});

export default function Home() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeTheme, setActiveTheme] = useState<EnvelopeTheme>("love");
  const [stage, setStage] = useState<"select" | "envelope">("select");
  const [selectedTheme, setSelectedTheme] = useState<EnvelopeTheme | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);

  const handleEnvelopeOpen = (theme: EnvelopeTheme) => {
    setIsMusicPlaying(true);
    setActiveTheme(theme);
  };

  const items: { title: string; theme: EnvelopeTheme; letters: string[][] }[] =
    [
      {
        title: "Open when you're sad",
        theme: "sad",
        letters: EMOTIONAL_LETTERS.sad,
      },
      {
        title: "Open when you're happy",
        theme: "happy",
        letters: EMOTIONAL_LETTERS.happy,
      },
      {
        title: "Open when you miss me",
        theme: "miss",
        letters: EMOTIONAL_LETTERS.miss,
      },
      {
        title: "Open when you're excited",
        theme: "excited",
        letters: EMOTIONAL_LETTERS.excited,
      },
      {
        title: "Open when you want to hear something nice",
        theme: "nice",
        letters: EMOTIONAL_LETTERS.nice,
      },
      {
        title: "Open when you feel lonely",
        theme: "lonely",
        letters: EMOTIONAL_LETTERS.lonely,
      },
      {
        title: "Open when you're angry",
        theme: "angry",
        letters: EMOTIONAL_LETTERS.angry,
      },
      {
        title: "Open when you can't sleep",
        theme: "cantSleep",
        letters: EMOTIONAL_LETTERS.cantSleep,
      },
      {
        title: "Open when you need a reminder of my love",
        theme: "loveReminder",
        letters: EMOTIONAL_LETTERS.loveReminder,
      },
      {
        title: "Open when you're bored",
        theme: "bored",
        letters: EMOTIONAL_LETTERS.bored,
      },
      {
        title: "Open when you're proud of yourself",
        theme: "proud",
        letters: EMOTIONAL_LETTERS.proud,
      },
      {
        title: "Open when you feel grateful",
        theme: "grateful",
        letters: EMOTIONAL_LETTERS.grateful,
      },
    ];

  const ICONS: Record<EnvelopeTheme, { Icon: any; color: string }> = {
    love: { Icon: Heart, color: "text-pink-500" },
    sad: { Icon: CloudRain, color: "text-blue-500" },
    lonely: { Icon: Moon, color: "text-indigo-500" },
    angry: { Icon: Flame, color: "text-orange-500" },
    happy: { Icon: Sun, color: "text-yellow-600" },
    miss: { Icon: Moon, color: "text-violet-600" },
    excited: { Icon: Stars, color: "text-fuchsia-600" },
    nice: { Icon: Smile, color: "text-teal-600" },
    cantSleep: { Icon: Moon, color: "text-purple-600" },
    loveReminder: { Icon: Heart, color: "text-rose-600" },
    bored: { Icon: Megaphone, color: "text-gray-600" },
    proud: { Icon: Star, color: "text-emerald-600" },
    grateful: { Icon: Coffee, color: "text-green-600" },
  };

  const PRIMARY_THEMES: EnvelopeTheme[] = [
    "sad",
    "happy",
    "miss",
    "loveReminder",
  ];
  const itemsToShow = showAll
    ? items
    : items.filter((it) => PRIMARY_THEMES.includes(it.theme));

  return (
    <main className='relative min-h-screen overflow-x-hidden'>
      <Background theme={activeTheme} />

      {stage === "select" && (
        <AnimatePresence>
          <motion.div
            key='selection-ui'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className='relative z-10 flex flex-col items-center min-h-screen py-12 px-4'>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-center mb-8 sm:mb-10 space-y-4'>
                <h1 className='text-4xl sm:text-6xl font-serif text-gray-800 tracking-tight'>
                  Hi,
                </h1>
                <h3 className='text-4xl sm:text-6xl font-serif text-gray-800 tracking-tight'>
                  Open when you need me...
                </h3>
                <p className='text-gray-500 font-serif italic text-lg'>
                  Pick the envelope that matches your heart right now.
                </p>
              </motion.div>

              <div
                aria-label='options grid'
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-6 w-full max-w-6xl'>
                {itemsToShow.map((it, idx) => (
                  <motion.button
                    key={it.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(0.02 * idx, 0.4) }}
                    onClick={() => setSelectedTheme(it.theme)}
                    aria-pressed={selectedTheme === it.theme}
                    aria-label={it.title}
                    className={
                      selectedTheme === it.theme
                        ? "rounded-2xl px-4 py-4 bg-white shadow-lg border border-gray-200 text-gray-800"
                        : "rounded-2xl px-4 py-4 bg-white/70 backdrop-blur border border-gray-200/70 text-gray-700 hover:bg-white hover:shadow"
                    }>
                    <span className='flex items-center gap-2 justify-center'>
                      <span
                        className={ICONS[it.theme].color}
                        aria-hidden='true'>
                        {(() => {
                          const { Icon } = ICONS[it.theme];
                          return <Icon className='w-4 h-4' />;
                        })()}
                      </span>
                      <span className='block text-sm sm:text-base font-medium font-serif'>
                        {it.title}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setShowAll(!showAll)}
                className='mt-4 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4'
                aria-label={
                  showAll ? "Show fewer options" : "Show more options"
                }>
                {showAll ? "Show fewer options" : "Show more options"}
              </button>

              <motion.button
                onClick={() => {
                  if (!selectedTheme) return;
                  setActiveTheme(selectedTheme);
                  setStage("envelope");
                }}
                disabled={!selectedTheme}
                className='mt-8 sm:mt-10 px-6 py-3 rounded-full bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-colors font-medium'
                aria-label='Open Envelope'>
                Open Envelope
              </motion.button>
            </div>

            <footer className='fixed bottom-3 left-1/2 -translate-x-1/2 z-20 text-[11px] sm:text-xs text-gray-500 font-serif italic pointer-events-none'>
              Made with <span aria-hidden='true'>❤️</span>
              <span className='sr-only'>love</span> by Koala
            </footer>
          </motion.div>
        </AnimatePresence>
      )}

      {stage === "envelope" && selectedTheme && (
        <AnimatePresence>
          <motion.div
            key='single-envelope'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='relative z-10 flex items-center justify-center min-h-screen px-4'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setStage("select");
                setSelectedTheme(null);
                setActiveTheme("love");
              }}
              className='fixed top-4 left-4 z-40 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-white shadow-sm'
              aria-label='Back to options'>
              Back to options
            </motion.button>
            <Envelope
              theme={selectedTheme}
              title={items.find((i) => i.theme === selectedTheme)!.title}
              letters={items.find((i) => i.theme === selectedTheme)!.letters}
              onOpen={() => handleEnvelopeOpen(selectedTheme)}
              className='min-h-[70vh]'
            />
            <footer className='fixed bottom-3 left-1/2 -translate-x-1/2 z-20 text-[11px] sm:text-xs text-gray-500 font-serif italic pointer-events-none'>
              Made with <span aria-hidden='true'>❤️</span>
              <span className='sr-only'>love</span> by Koala
            </footer>
          </motion.div>
        </AnimatePresence>
      )}

      <MusicPlayer
        isPlaying={isMusicPlaying}
        onToggle={() => setIsMusicPlaying(!isMusicPlaying)}
      />
    </main>
  );
}
