"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Heart = ({ delay, x, size }: { delay: number; x: string; size: number }) => (
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
    className="fixed text-pink-300 pointer-events-none select-none"
    style={{ left: x, fontSize: size }}
  >
    ♥
  </motion.div>
);

export default function Background() {
  const [hearts, setHearts] = useState<{ id: number; x: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      delay: Math.random() * 20,
      size: Math.random() * (24 - 12) + 12,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blush to-cream transition-colors duration-1000">
      {hearts.map((heart) => (
        <Heart key={heart.id} {...heart} />
      ))}
    </div>
  );
}
