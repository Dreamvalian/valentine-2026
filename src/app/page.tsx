"use client";

import Background from "@/components/Background";
import CustomCursor from "@/components/CustomCursor";
import Envelope from "@/components/Envelope";
import MusicPlayer from "@/components/MusicPlayer";
import { useState } from "react";

export default function Home() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleEnvelopeOpen = () => {
    // When the envelope is opened, we signal that music should be active.
    // Due to browser policies, the user click on the envelope serves as the gesture.
    setIsMusicPlaying(true);
  };

  return (
    <main className='relative min-h-screen overflow-hidden'>
      <CustomCursor />
      <Background />

      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen'>
        <Envelope onOpen={handleEnvelopeOpen} />
      </div>

      <MusicPlayer
        isPlaying={isMusicPlaying}
        onToggle={() => setIsMusicPlaying(!isMusicPlaying)}
      />
    </main>
  );
}
