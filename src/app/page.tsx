"use client";

import Background from "@/components/Background";
import Envelope, { EnvelopeTheme } from "@/components/Envelope";
import { EMOTIONAL_LETTERS } from "@/lib/content";
import { AnimatePresence, motion } from "framer-motion";
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
  const [feelingInput, setFeelingInput] = useState("");
  const [inputError, setInputError] = useState("");

  const handleEnvelopeOpen = (theme: EnvelopeTheme) => {
    setIsMusicPlaying(true);
    setActiveTheme(theme);
  };

  const THEME_TITLES: Record<EnvelopeTheme, string> = {
    sad: "Open when you're sad",
    happy: "Open when you're happy",
    miss: "Open when you miss me",
    excited: "Open when you're excited",
    nice: "Open when you want to hear something nice",
    lonely: "Open when you feel lonely",
    angry: "Open when you're angry",
    cantSleep: "Open when you can't sleep",
    loveReminder: "Open when you need a reminder of my love",
    bored: "Open when you're bored",
    proud: "Open when you're proud of yourself",
    grateful: "Open when you feel grateful",
    love: "Open when you just need a little love",
  };

  const MOOD_PRESETS = [
    {
      id: "lonely",
      label: "Lonely",
      text: "I'm feeling really lonely tonight.",
    },
    {
      id: "sad",
      label: "Sad",
      text: "I'm feeling sad and a bit low.",
    },
    {
      id: "anxious",
      label: "Anxious",
      text: "I'm feeling anxious about everything coming up.",
    },
    {
      id: "angry",
      label: "Frustrated",
      text: "I'm feeling frustrated and a little angry.",
    },
    {
      id: "happy",
      label: "Light",
      text: "I'm feeling light and quietly happy.",
    },
    {
      id: "tired",
      label: "Drained",
      text: "I'm feeling drained and low on energy.",
    },
  ];

  const detectThemeFromText = (text: string): EnvelopeTheme => {
    const value = text.toLowerCase();
    if (
      value.includes("lonely") ||
      value.includes("alone") ||
      value.includes("isolated")
    ) {
      return "lonely";
    }
    if (
      value.includes("sad") ||
      value.includes("down") ||
      value.includes("low") ||
      value.includes("depressed")
    ) {
      return "sad";
    }
    if (
      value.includes("anxious") ||
      value.includes("anxiety") ||
      value.includes("stressed") ||
      value.includes("stress") ||
      value.includes("overwhelmed") ||
      value.includes("worried") ||
      value.includes("nervous")
    ) {
      return "cantSleep";
    }
    if (
      value.includes("angry") ||
      value.includes("mad") ||
      value.includes("frustrated")
    ) {
      return "angry";
    }
    if (value.includes("bored") || value.includes("restless")) {
      return "bored";
    }
    if (value.includes("proud") || value.includes("accomplished")) {
      return "proud";
    }
    if (value.includes("grateful") || value.includes("thankful")) {
      return "grateful";
    }
    if (
      value.includes("happy") ||
      value.includes("good") ||
      value.includes("better")
    ) {
      return "happy";
    }
    if (value.includes("excited")) {
      return "excited";
    }
    if (value.includes("miss") || value.includes("missing")) {
      return "miss";
    }
    return "loveReminder";
  };

  const handleGenerateEnvelope = () => {
    if (!feelingInput.trim()) {
      setInputError("Tell me a little about how you are feeling.");
      return;
    }
    setInputError("");
    const theme = detectThemeFromText(feelingInput);
    setSelectedTheme(theme);
    setActiveTheme(theme);
    setStage("envelope");
  };

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
                  Sugar, how are you feeling today?
                </h3>
                <p className='text-gray-500 font-serif italic text-lg'>
                  Share what’s on your heart — I’ll choose a letter that fits
                  your mood.
                </p>
              </motion.div>

              <div className='w-full max-w-xl space-y-4'>
                <label
                  htmlFor='feeling-input'
                  className='block text-sm font-serif text-gray-600 mt-4'>
                  In your own words, how are you feeling right now?
                </label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {MOOD_PRESETS.map((mood) => {
                    const isSelected = feelingInput === mood.text;
                    return (
                      <button
                        key={mood.id}
                        type='button'
                        onClick={() => {
                          setFeelingInput(mood.text);
                          setInputError("");
                        }}
                        aria-pressed={isSelected}
                        className={`px-3 py-1 rounded-full border text-xs sm:text-sm transition-colors ${
                          isSelected
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white/80 text-gray-700 border-gray-200 hover:bg-gray-900/5"
                        }`}>
                        {mood.label}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  id='feeling-input'
                  value={feelingInput}
                  onChange={(e) => setFeelingInput(e.target.value)}
                  placeholder='For example: a bit anxious about tomorrow, really lonely tonight, or quietly proud of yourself.'
                  className='w-full min-h-[120px] rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300'
                  aria-label='Describe how they are feeling in your own words'
                />
                {inputError && (
                  <p className='text-sm text-red-500 font-serif'>
                    {inputError}
                  </p>
                )}

                <motion.button
                  onClick={handleGenerateEnvelope}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className='mt-4 w-full px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-black transition-colors font-medium'
                  aria-label='Gently open an envelope'>
                  Gently open an envelope
                </motion.button>
              </div>
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
                setFeelingInput("");
                setInputError("");
              }}
              className='fixed top-4 left-4 z-40 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-white shadow-sm'
              aria-label='Back to options'>
              Back to options
            </motion.button>
            <Envelope
              theme={selectedTheme}
              title={THEME_TITLES[selectedTheme]}
              letters={EMOTIONAL_LETTERS[selectedTheme]}
              onOpen={() => handleEnvelopeOpen(selectedTheme)}
              className='min-h-[70vh]'
              moodDescription={feelingInput}
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
