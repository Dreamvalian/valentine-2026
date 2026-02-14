"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const Heart = ({
  delay,
  x,
  size,
  color,
}: {
  delay: number;
  x: string;
  size: number;
  color: string;
}) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0 }}
    animate={{
      y: "-10vh",
      opacity: [0, 0.3, 0.3, 0],
      x: ["0%", "5%", "-5%", "0%"],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      delay,
      ease: "linear",
    }}
    className={cn("fixed pointer-events-none select-none", color)}
    style={{ left: x, fontSize: size }}>
    ♥
  </motion.div>
);

interface BackgroundProps {
  theme?:
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
}

export default function Background({ theme = "love" }: BackgroundProps) {
  const [elements, setElements] = useState<
    { id: number; x: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      delay: Math.random() * 20,
      size: Math.random() * (24 - 12) + 12,
    }));
    setElements(newElements);
  }, []);

  const getThemeStyles = () => {
    switch (theme) {
      case "lonely":
        return {
          bg: "from-indigo-100 to-slate-50",
          color: "text-indigo-300",
        };
      case "sad":
        return {
          bg: "from-blue-100 to-sky-50",
          color: "text-blue-300",
        };
      case "angry":
        return {
          bg: "from-orange-100 to-rose-50",
          color: "text-orange-300",
        };
      case "happy":
        return {
          bg: "from-yellow-100 to-amber-50",
          color: "text-yellow-300",
        };
      case "miss":
        return {
          bg: "from-violet-100 to-purple-50",
          color: "text-violet-300",
        };
      case "excited":
        return {
          bg: "from-fuchsia-100 to-pink-50",
          color: "text-fuchsia-300",
        };
      case "nice":
        return {
          bg: "from-teal-100 to-cyan-50",
          color: "text-teal-300",
        };
      case "cantSleep":
        return {
          bg: "from-purple-100 to-indigo-50",
          color: "text-purple-300",
        };
      case "loveReminder":
        return {
          bg: "from-rose-100 to-pink-50",
          color: "text-rose-300",
        };
      case "bored":
        return {
          bg: "from-gray-100 to-stone-50",
          color: "text-gray-300",
        };
      case "proud":
        return {
          bg: "from-emerald-100 to-green-50",
          color: "text-emerald-300",
        };
      case "grateful":
        return {
          bg: "from-green-100 to-lime-50",
          color: "text-green-300",
        };
      default:
        return {
          bg: "from-blush to-cream",
          color: "text-pink-300",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br transition-all duration-1000",
        styles.bg,
      )}>
      <AnimatePresence>
        {elements.map((el) => (
          <Heart key={`${theme}-${el.id}`} {...el} color={styles.color} />
        ))}
      </AnimatePresence>
    </div>
  );
}
