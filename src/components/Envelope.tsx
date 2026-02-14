"use client";

import { getGuidanceAccent } from "@/lib/themeGuidance";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  CloudRain,
  Coffee,
  Droplets,
  Flame,
  Heart,
  Megaphone,
  MessageCircleHeart,
  Moon,
  Smile,
  Sparkles,
  Star,
  Stars,
  Sun,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import PaperTexture from "./PaperTexture";
const ReplyModal = dynamic(() => import("./ReplyModal"), { ssr: false });

export type EnvelopeTheme =
  | "lonely"
  | "sad"
  | "angry"
  | "love"
  | "happy"
  | "miss"
  | "excited"
  | "nice"
  | "cantSleep"
  | "loveReminder"
  | "bored"
  | "proud"
  | "grateful";

const THEME_CONFIG = {
  love: {
    sealIcon: Heart,
    sealColor: "bg-pink-400",
    hoverSealColor: "group-hover:bg-pink-500",
    bgGradient: "border-l-pink-50/50 border-r-pink-50/50",
    innerBg: "bg-pink-50/80",
    accentText: "text-pink-500",
    buttonBg:
      "bg-pink-400 hover:bg-pink-500 shadow-pink-100 hover:shadow-pink-200",
    decorationColor: "text-pink-300",
    shadowColor: "group-hover:shadow-pink-200/50",
    labelColor: "text-pink-400/60",
    closeHover: "hover:text-pink-400",
  },
  lonely: {
    sealIcon: Moon,
    sealColor: "bg-indigo-400",
    hoverSealColor: "group-hover:bg-indigo-500",
    bgGradient: "border-l-indigo-50/50 border-r-indigo-50/50",
    innerBg: "bg-indigo-50/80",
    accentText: "text-indigo-500",
    buttonBg:
      "bg-indigo-400 hover:bg-indigo-500 shadow-indigo-100 hover:shadow-indigo-200",
    decorationColor: "text-indigo-300",
    shadowColor: "group-hover:shadow-indigo-200/50",
    labelColor: "text-indigo-400/60",
    closeHover: "hover:text-indigo-400",
  },
  sad: {
    sealIcon: CloudRain,
    sealColor: "bg-blue-400",
    hoverSealColor: "group-hover:bg-blue-500",
    bgGradient: "border-l-blue-50/50 border-r-blue-50/50",
    innerBg: "bg-blue-50/80",
    accentText: "text-blue-500",
    buttonBg:
      "bg-blue-400 hover:bg-blue-500 shadow-blue-100 hover:shadow-blue-200",
    decorationColor: "text-blue-300",
    shadowColor: "group-hover:shadow-blue-200/50",
    labelColor: "text-blue-400/60",
    closeHover: "hover:text-blue-400",
  },
  angry: {
    sealIcon: Flame,
    sealColor: "bg-orange-400",
    hoverSealColor: "group-hover:bg-orange-500",
    bgGradient: "border-l-orange-50/50 border-r-orange-50/50",
    innerBg: "bg-orange-50/80",
    accentText: "text-orange-500",
    buttonBg:
      "bg-orange-400 hover:bg-orange-500 shadow-orange-100 hover:shadow-orange-200",
    decorationColor: "text-orange-300",
    shadowColor: "group-hover:shadow-orange-200/50",
    labelColor: "text-orange-400/60",
    closeHover: "hover:text-orange-400",
  },
  happy: {
    sealIcon: Sun,
    sealColor: "bg-yellow-400",
    hoverSealColor: "group-hover:bg-yellow-500",
    bgGradient: "border-l-yellow-50/50 border-r-yellow-50/50",
    innerBg: "bg-yellow-50/80",
    accentText: "text-yellow-600",
    buttonBg:
      "bg-yellow-400 hover:bg-yellow-500 shadow-yellow-100 hover:shadow-yellow-200",
    decorationColor: "text-yellow-300",
    shadowColor: "group-hover:shadow-yellow-200/50",
    labelColor: "text-yellow-500/60",
    closeHover: "hover:text-yellow-500",
  },
  miss: {
    sealIcon: Moon,
    sealColor: "bg-violet-500",
    hoverSealColor: "group-hover:bg-violet-600",
    bgGradient: "border-l-violet-50/50 border-r-violet-50/50",
    innerBg: "bg-violet-50/80",
    accentText: "text-violet-600",
    buttonBg:
      "bg-violet-500 hover:bg-violet-600 shadow-violet-100 hover:shadow-violet-200",
    decorationColor: "text-violet-300",
    shadowColor: "group-hover:shadow-violet-200/50",
    labelColor: "text-violet-500/60",
    closeHover: "hover:text-violet-500",
  },
  excited: {
    sealIcon: Stars,
    sealColor: "bg-fuchsia-500",
    hoverSealColor: "group-hover:bg-fuchsia-600",
    bgGradient: "border-l-fuchsia-50/50 border-r-fuchsia-50/50",
    innerBg: "bg-fuchsia-50/80",
    accentText: "text-fuchsia-600",
    buttonBg:
      "bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-100 hover:shadow-fuchsia-200",
    decorationColor: "text-fuchsia-300",
    shadowColor: "group-hover:shadow-fuchsia-200/50",
    labelColor: "text-fuchsia-500/60",
    closeHover: "hover:text-fuchsia-500",
  },
  nice: {
    sealIcon: Smile,
    sealColor: "bg-teal-500",
    hoverSealColor: "group-hover:bg-teal-600",
    bgGradient: "border-l-teal-50/50 border-r-teal-50/50",
    innerBg: "bg-teal-50/80",
    accentText: "text-teal-600",
    buttonBg:
      "bg-teal-500 hover:bg-teal-600 shadow-teal-100 hover:shadow-teal-200",
    decorationColor: "text-teal-300",
    shadowColor: "group-hover:shadow-teal-200/50",
    labelColor: "text-teal-500/60",
    closeHover: "hover:text-teal-500",
  },
  cantSleep: {
    sealIcon: Moon,
    sealColor: "bg-purple-500",
    hoverSealColor: "group-hover:bg-purple-600",
    bgGradient: "border-l-purple-50/50 border-r-purple-50/50",
    innerBg: "bg-purple-50/80",
    accentText: "text-purple-600",
    buttonBg:
      "bg-purple-500 hover:bg-purple-600 shadow-purple-100 hover:shadow-purple-200",
    decorationColor: "text-purple-300",
    shadowColor: "group-hover:shadow-purple-200/50",
    labelColor: "text-purple-500/60",
    closeHover: "hover:text-purple-500",
  },
  loveReminder: {
    sealIcon: Heart,
    sealColor: "bg-rose-500",
    hoverSealColor: "group-hover:bg-rose-600",
    bgGradient: "border-l-rose-50/50 border-r-rose-50/50",
    innerBg: "bg-rose-50/80",
    accentText: "text-rose-600",
    buttonBg:
      "bg-rose-500 hover:bg-rose-600 shadow-rose-100 hover:shadow-rose-200",
    decorationColor: "text-rose-300",
    shadowColor: "group-hover:shadow-rose-200/50",
    labelColor: "text-rose-500/60",
    closeHover: "hover:text-rose-500",
  },
  bored: {
    sealIcon: Megaphone,
    sealColor: "bg-gray-500",
    hoverSealColor: "group-hover:bg-gray-600",
    bgGradient: "border-l-gray-50/50 border-r-gray-50/50",
    innerBg: "bg-gray-50/80",
    accentText: "text-gray-600",
    buttonBg:
      "bg-gray-500 hover:bg-gray-600 shadow-gray-100 hover:shadow-gray-200",
    decorationColor: "text-gray-300",
    shadowColor: "group-hover:shadow-gray-200/50",
    labelColor: "text-gray-500/60",
    closeHover: "hover:text-gray-500",
  },
  proud: {
    sealIcon: Star,
    sealColor: "bg-emerald-500",
    hoverSealColor: "group-hover:bg-emerald-600",
    bgGradient: "border-l-emerald-50/50 border-r-emerald-50/50",
    innerBg: "bg-emerald-50/80",
    accentText: "text-emerald-600",
    buttonBg:
      "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100 hover:shadow-emerald-200",
    decorationColor: "text-emerald-300",
    shadowColor: "group-hover:shadow-emerald-200/50",
    labelColor: "text-emerald-500/60",
    closeHover: "hover:text-emerald-500",
  },
  grateful: {
    sealIcon: Coffee,
    sealColor: "bg-green-500",
    hoverSealColor: "group-hover:bg-green-600",
    bgGradient: "border-l-green-50/50 border-r-green-50/50",
    innerBg: "bg-green-50/80",
    accentText: "text-green-600",
    buttonBg:
      "bg-green-500 hover:bg-green-600 shadow-green-100 hover:shadow-green-200",
    decorationColor: "text-green-300",
    shadowColor: "group-hover:shadow-green-200/50",
    labelColor: "text-green-500/60",
    closeHover: "hover:text-green-500",
  },
};

interface EnvelopeProps {
  theme?: EnvelopeTheme;
  onOpen?: () => void;
  title?: string;
  letters?: string[][];
  recipientName?: string;
  senderName?: string;
  className?: string;
}

const DecorativeElements = ({ theme }: { theme: EnvelopeTheme }) => {
  const config = THEME_CONFIG[theme];

  const icons = useMemo(() => {
    switch (theme) {
      case "lonely":
        return [Star, Moon];
      case "sad":
        return [Droplets, CloudRain];
      case "angry":
        return [Flame, Sparkles];
      case "happy":
        return [Sun, Star];
      case "excited":
        return [Sparkles, Stars];
      case "nice":
        return [Heart, Smile];
      case "cantSleep":
        return [Moon, Star];
      case "loveReminder":
        return [Heart, Sparkles];
      case "bored":
        return [Star, Megaphone];
      case "proud":
        return [Star, Sparkles];
      case "grateful":
        return [Heart, Star];
      default:
        return [Heart, Star];
    }
  }, [theme]);

  const PrimaryIcon = icons[0];
  const SecondaryIcon = icons[1];

  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }).map(() => ({
        left: 5 + Math.random() * 90,
        startTop: 100 + Math.random() * 40,
        driftX: (Math.random() - 0.5) * 60,
        rise: 200 + Math.random() * 260,
        scale: 0.6 + Math.random() * 0.8,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 3,
        opacity: 0.25 + Math.random() * 0.5,
        z: Math.random() > 0.6 ? 1 : 0,
      })),
    [theme],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 12 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 10 + Math.random() * 8,
        duration: 2.5 + Math.random() * 2.5,
        delay: Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.6,
      })),
    [theme],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        left: 5 + Math.random() * 90,
        startTop: 110 + Math.random() * 30,
        curveX1: (Math.random() - 0.5) * 80,
        curveX2: (Math.random() - 0.5) * 120,
        fall: 240 + Math.random() * 240,
        rotate: 90 + Math.random() * 180,
        size: 3 + Math.floor(Math.random() * 3),
        duration: 7 + Math.random() * 5,
        delay: Math.random() * 2,
        opacity: 0.15 + Math.random() * 0.45,
      })),
    [theme],
  );

  return (
    <>
      {hearts.map((p, i) => (
        <motion.div
          key={`heart-${i}`}
          initial={{ opacity: 0, y: 0, scale: p.scale * 0.9 }}
          animate={{
            opacity: [0, p.opacity, 0],
            y: [0, -p.rise],
            x: [0, p.driftX, p.driftX * 0.6],
            scale: [p.scale * 0.9, p.scale * 1.05, p.scale],
            rotateZ: [0, 6, -6, 0],
          }}
          transition={{
            duration: p.duration,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            delay: p.delay,
          }}
          aria-hidden='true'
          className={cn("absolute pointer-events-none", config.decorationColor)}
          style={{ left: `${p.left}%`, top: `${p.startTop}%`, zIndex: p.z }}>
          <Heart size={14} className='opacity-80' fill='currentColor' />
        </motion.div>
      ))}

      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          aria-hidden='true'
          className={cn(
            "absolute pointer-events-none opacity-60",
            config.decorationColor,
          )}
          style={{ left: `${s.left}%`, top: `${s.top}%` }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, s.opacity, 0.2],
              rotateZ: [0, 360],
              scale: [0.8, 1, 0.9],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              ease: "linear",
              delay: s.delay,
            }}>
            <Star size={s.size} fill='currentColor' />
          </motion.div>
        </motion.div>
      ))}

      {confetti.map((c, i) => (
        <motion.div
          key={`conf-${i}`}
          initial={{ opacity: 0, x: 0, y: 0, rotateZ: 0 }}
          animate={{
            opacity: [0, c.opacity, 0],
            y: [0, -c.fall * 0.5, -c.fall],
            x: [0, c.curveX1, c.curveX2],
            rotateZ: [0, c.rotate / 2, c.rotate],
          }}
          transition={{
            duration: c.duration,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            delay: c.delay,
          }}
          aria-hidden='true'
          className='absolute pointer-events-none z-0'
          style={{ left: `${c.left}%`, top: `${c.startTop}%` }}>
          <div
            className={cn("rounded-sm", config.decorationColor)}
            style={{
              width: c.size,
              height: c.size * 2,
              transformOrigin: "center",
              opacity: c.opacity,
            }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default function Envelope({
  theme = "love",
  onOpen,
  title = "Click to open",
  letters = [["No content available"]],
  recipientName = "Sugar",
  senderName = "Koala",
  className,
}: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [letterContent, setLetterContent] = useState(letters[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const supports3D =
    typeof window !== "undefined" &&
    (window as any).CSS &&
    (CSS as any).supports?.("transform-style: preserve-3d");

  const config = THEME_CONFIG[theme];
  const SealIcon = config.sealIcon;
  const guidance = getGuidanceAccent(theme);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [openYOffset, setOpenYOffset] = useState(0);

  const calcCenterOffset = () => {
    if (!containerRef.current || !wrapperRef.current) return 0;
    const c = containerRef.current.getBoundingClientRect();
    const t = wrapperRef.current.getBoundingClientRect();
    const cy = c.top + c.height / 2;
    const ty = t.top + t.height / 2;
    return Math.round(cy - ty);
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setOpenYOffset(calcCenterOffset());
    if (isOpen) update();
    const onResize = () => {
      if (isOpen) update();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      onOpen?.();
    }
  };

  const generateNewLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (letters.length <= 1) return;

    setIsGenerating(true);
    setTimeout(() => {
      const currentIndex = letters.indexOf(letterContent);
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * letters.length);
      } while (nextIndex === currentIndex && letters.length > 1);

      setLetterContent(letters[nextIndex]);
      setIsGenerating(false);
    }, 400);
  };

  const handleSendReply = async (message: string) => {
    const response = await fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, theme }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to send message";
      try {
        const data = await response.json();
        errorMessage = data.error || errorMessage;
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <div
      className={cn("relative flex items-center justify-center p-4", className)}
      ref={containerRef}>
      <div
        className={cn(
          "relative perspective-1000 transition-all duration-1000",
          !isOpen
            ? "cursor-pointer group scale-100 hover:scale-105"
            : "scale-100",
        )}
        ref={wrapperRef}
        onClick={handleOpen}
        role='button'
        tabIndex={0}
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}>
        <DecorativeElements theme={theme} />

        {/* Envelope Body */}
        <motion.div
          animate={
            isOpen
              ? {
                  y: openYOffset,
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
          className={cn(
            "relative w-[280px] h-[180px] sm:w-[350px] sm:h-[240px] bg-white rounded-b-lg shadow-2xl z-20 overflow-visible transition-shadow duration-700",
            config.shadowColor,
          )}>
          <PaperTexture className='z-10 opacity-60' />

          <div className='absolute inset-0 bg-white rounded-b-lg overflow-hidden'>
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-full border-[140px] sm:border-[175px] border-transparent",
                config.bgGradient,
              )}
            />
            <div className='absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/30 to-transparent' />
          </div>

          {/* Flap */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? supports3D
                  ? { rotateX: 180, zIndex: 0 }
                  : { y: 10, opacity: 0.95, zIndex: 0 }
                : supports3D
                  ? { rotateX: 0, zIndex: 30 }
                  : { y: 0, opacity: 1, zIndex: 30 }
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
              className={cn(
                "absolute inset-0 rounded-t-lg backface-hidden",
                config.innerBg,
              )}
              style={{ transform: "rotateX(180deg)" }}
            />

            {/* Seal */}
            <motion.div
              animate={
                isOpen
                  ? { opacity: 0, scale: 0.5, y: -20 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              transition={{ duration: 0.4 }}
              className={cn(
                "absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl z-40 transition-all group-hover:scale-110",
                config.sealColor,
                config.hoverSealColor,
              )}>
              <SealIcon className='text-white w-5 h-5' fill='currentColor' />
              <div
                className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-20",
                  config.sealColor,
                )}
              />
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
              className='absolute left-1/2 -translate-x-1/2 top-0 w-[300px] sm:w-[450px] bg-paper p-8 sm:p-10 rounded-[24px] z-50 overflow-hidden border border-white/50'>
              <PaperTexture className='z-0' />

              {/* Sparkle Generate Button */}
              {letters.length > 1 && (
                <button
                  onClick={generateNewLetter}
                  disabled={isGenerating}
                  className={cn(
                    "absolute top-6 right-6 p-2 transition-colors group z-10",
                    config.accentText,
                  )}
                  aria-label='Generate new letter'>
                  <Sparkles
                    className={cn("w-5 h-5", isGenerating && "animate-spin")}
                  />
                  <span className='absolute right-0 top-full mt-1 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                    Magic
                  </span>
                </button>
              )}

              <div className='relative z-10 flex flex-col items-center text-center space-y-6'>
                <div className='font-serif text-base sm:text-xl leading-relaxed text-gray-700 min-h-[150px] flex flex-col justify-center'>
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
                            delay: i * 0.1,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className={
                            i === letterContent.length - 1
                              ? cn("mt-6 font-semibold", config.accentText)
                              : "mb-1"
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
                      className={cn(
                        "flex items-center gap-2 px-10 w-full sm:w-auto text-white",
                        config.buttonBg,
                      )}
                      aria-label={`Reply to ${senderName}`}>
                      Reply to {senderName}
                      <MessageCircleHeart className='w-4 h-4' />
                    </Button>
                    <p
                      className={cn(
                        "text-sm sm:text-base font-serif italic transition-colors duration-500 ease-out",
                        guidance.textClass,
                      )}>
                      Want to share how you feel? Tap Reply — I’m listening.
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "text-[10px] uppercase tracking-widest text-gray-400 transition-colors duration-300 pt-2",
                      config.closeHover,
                    )}
                    aria-label='Close letter'>
                    Close with love
                  </button>
                </motion.div>
              </div>

              <div
                className={cn(
                  "absolute inset-0 rounded-[24px] blur-2xl -z-10 pointer-events-none opacity-10",
                  config.innerBg,
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={cn(
              "absolute -bottom-10 left-1/2 -translate-x-1/2 font-serif italic text-xs pointer-events-none whitespace-nowrap",
              config.labelColor,
            )}>
            {title}
          </motion.div>
        )}
      </div>

      <ReplyModal
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        onSend={handleSendReply}
        theme={theme}
      />
    </div>
  );
}
