"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircleHeart, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import Button from "./Button";
import PaperTexture from "./PaperTexture";
import ReplyModal from "./ReplyModal";

const LOVE_LETTERS = [
  [
    "Hi Sugar,",
    "Just wanted to send a little sunshine your way today.",
    "Thinking of you and the quiet joy you bring into my life.",
    "Have a beautiful day.",
    "Warmly, Koala",
  ],
  [
    "Hello Sugar,",
    "Your smile is easily the best part of my day.",
    "I hope your morning is as lovely and bright as you are.",
    "Sending you a little hug.",
    "Always, Koala",
  ],
  [
    "To my Sugar,",
    "Sometimes the smallest moments with you stay with me the longest.",
    "Thank you for simply being you.",
    "You make everything a little bit better.",
    "With care, Koala",
  ],
  [
    "Hey Sugar,",
    "Just a small reminder that you're appreciated more than you know.",
    "I'm so glad our paths crossed.",
    "Hope this brings a smile to your face.",
    "Thinking of you, Koala",
  ],
];

interface EnvelopeProps {
  onOpen?: () => void;
}

const DecorativeElements = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={`heart-${i}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.6, 0],
          y: [0, -40 - Math.random() * 60],
          x: [0, (Math.random() - 0.5) * 40],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.8,
        }}
        className='absolute text-pink-300 pointer-events-none z-0'
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
        }}>
        <Heart size={16 + Math.random() * 8} fill='currentColor' />
      </motion.div>
    ))}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={`star-${i}`}
        className='absolute text-cream animate-twinkle pointer-events-none z-0'
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}>
        <Star size={12} fill='currentColor' />
      </motion.div>
    ))}
  </>
);

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [letterContent, setLetterContent] = useState(LOVE_LETTERS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      onOpen?.();
    }
  };

  const generateNewLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    setTimeout(() => {
      const currentIndex = LOVE_LETTERS.indexOf(letterContent);
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * LOVE_LETTERS.length);
      } while (nextIndex === currentIndex);

      setLetterContent(LOVE_LETTERS[nextIndex]);
      setIsGenerating(false);
    }, 400);
  };

  const handleSendReply = async (message: string) => {
    const response = await fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to send message");
    }
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen p-4 overflow-hidden'>
      <div
        className={cn(
          "relative perspective-1000 transition-all duration-1000",
          !isOpen
            ? "cursor-pointer group scale-100 hover:scale-105"
            : "scale-100",
        )}
        onClick={handleOpen}>
        <DecorativeElements />

        {/* Envelope Body */}
        <motion.div
          animate={
            isOpen
              ? {
                  y: 180,
                  opacity: 0.7,
                  scale: 0.85,
                  rotateZ: -1,
                  filter: "brightness(0.9) blur(1px)",
                }
              : {
                  y: 0,
                  rotateZ: 0,
                  filter: "brightness(1) blur(0px)",
                }
          }
          transition={{
            duration: 1.2,
            ease: [0.68, -0.55, 0.265, 1.55],
          }}
          className='relative w-[320px] h-[220px] sm:w-[450px] sm:h-[300px] bg-white rounded-b-lg shadow-2xl z-20 overflow-visible group-hover:shadow-pink-200/50 transition-shadow duration-700'>
          <PaperTexture className='z-10 opacity-60' />

          <div className='absolute inset-0 bg-white rounded-b-lg overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-full border-[160px] sm:border-[225px] border-transparent border-l-pink-50/50 border-r-pink-50/50' />
            <div className='absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-pink-50/30 to-transparent' />
          </div>

          {/* Flap */}
          <motion.div
            initial={false}
            animate={
              isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 30 }
            }
            transition={{
              duration: 1,
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
            className='absolute top-0 left-0 w-full h-1/2 bg-white rounded-t-lg shadow-md origin-bottom preserve-3d'
            style={{ transformStyle: "preserve-3d" }}>
            <PaperTexture className='z-10 opacity-50' />
            <div className='absolute inset-0 bg-white rounded-t-lg backface-hidden shadow-inner' />
            <div
              className='absolute inset-0 bg-pink-50/80 rounded-t-lg backface-hidden'
              style={{ transform: "rotateX(180deg)" }}
            />

            {/* Seal/Heart */}
            <motion.div
              animate={
                isOpen
                  ? { opacity: 0, scale: 0.5, y: -20 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              transition={{ duration: 0.4 }}
              className='absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center shadow-xl z-40 group-hover:bg-pink-500 transition-all group-hover:scale-110'>
              <Heart className='text-white w-5 h-5' fill='currentColor' />
              <div className='absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20' />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Letter Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: 0, opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{
                y: -220,
                opacity: 1,
                scale: 1,
                rotateX: 0,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              exit={{ y: 0, opacity: 0, scale: 0.9 }}
              transition={{
                delay: 0.6,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className='absolute left-1/2 -translate-x-1/2 top-0 w-[300px] sm:w-[500px] bg-paper p-8 sm:p-12 rounded-[24px] z-50 overflow-hidden border border-white/50'>
              <PaperTexture className='z-0' />

              {/* Sparkle Generate Button */}
              <button
                onClick={generateNewLetter}
                disabled={isGenerating}
                className='absolute top-6 right-6 p-2 text-pink-300 hover:text-pink-500 transition-colors group z-10'
                aria-label='Generate new letter'>
                <Sparkles
                  className={cn("w-5 h-5", isGenerating && "animate-spin")}
                />
                <span className='absolute right-0 top-full mt-1 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                  Magic
                </span>
              </button>

              <div className='relative z-10 flex flex-col items-center text-center space-y-6'>
                <div className='font-serif text-lg sm:text-2xl leading-relaxed text-gray-700 min-h-[200px] flex flex-col justify-center'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={letterContent.join("")}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}>
                      {letterContent.map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: i * 0.2,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className={
                            i === letterContent.length - 1
                              ? "mt-8 font-semibold text-pink-500"
                              : ""
                          }>
                          {line}
                        </motion.p>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className='flex flex-col items-center gap-4 w-full'>
                  <div className='flex flex-col items-center gap-3 w-full justify-center'>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsReplyOpen(true);
                      }}
                      className='flex items-center gap-2 px-12 bg-pink-400 hover:bg-pink-500 shadow-pink-100 hover:shadow-pink-200 w-full sm:w-auto'
                      aria-label='Reply to Koala'>
                      Reply to Koala
                      <MessageCircleHeart className='w-4 h-4' />
                    </Button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className='text-xs uppercase tracking-widest text-gray-400 hover:text-pink-400 transition-colors duration-300 pt-2'
                    aria-label='Close letter'>
                    Close with love
                  </button>
                </motion.div>
              </div>

              <div className='absolute inset-0 rounded-[24px] bg-pink-200/5 blur-2xl -z-10 pointer-events-none' />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className='absolute -bottom-12 left-1/2 -translate-x-1/2 text-pink-400/60 font-serif italic text-sm pointer-events-none'>
            Click to open
          </motion.div>
        )}
      </div>

      <ReplyModal
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        onSend={handleSendReply}
      />
    </div>
  );
}
