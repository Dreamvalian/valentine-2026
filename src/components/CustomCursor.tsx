"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export default function CustomCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth cursor movement
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Add a new particle to the trail
      const newParticle: Particle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        scale: Math.random() * 0.5 + 0.5,
      };

      setParticles((prev) => [...prev.slice(-15), newParticle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Remove particles after they fade out
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.filter((p) => p.id > Math.max(...prev.map((p) => p.id)) - 20),
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='fixed inset-0 pointer-events-none z-[9999]'>
      {/* Trail Particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0.6, scale: particle.scale }}
          animate={{ opacity: 0, scale: 0, y: 10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            x: "-50%",
            y: "-50%",
          }}
          className='text-pink-300/40'>
          <Heart size={12} fill='currentColor' />
        </motion.div>
      ))}

      {/* Main Cursor */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        className='absolute text-pink-500 drop-shadow-md'>
        <Heart size={24} fill='currentColor' />
      </motion.div>
    </div>
  );
}
