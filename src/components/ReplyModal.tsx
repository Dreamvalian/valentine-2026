"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CloudRain, Flame, Heart, Moon, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";
import Button from "./Button";
import { EnvelopeTheme } from "./Envelope";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
  theme?: EnvelopeTheme;
}

const THEME_CONFIG = {
  love: {
    icon: Heart,
    color: "text-pink-500",
    fill: "fill-pink-500",
    focus: "focus:border-pink-200",
    button: "bg-pink-500 hover:bg-pink-600",
    success: "text-green-500",
  },
  lonely: {
    icon: Moon,
    color: "text-indigo-500",
    fill: "fill-indigo-500",
    focus: "focus:border-indigo-200",
    button: "bg-indigo-500 hover:bg-indigo-600",
    success: "text-green-500",
  },
  sad: {
    icon: CloudRain,
    color: "text-blue-500",
    fill: "fill-blue-500",
    focus: "focus:border-blue-200",
    button: "bg-blue-500 hover:bg-blue-600",
    success: "text-green-500",
  },
  angry: {
    icon: Flame,
    color: "text-orange-500",
    fill: "fill-orange-500",
    focus: "focus:border-orange-200",
    button: "bg-orange-500 hover:bg-orange-600",
    success: "text-green-500",
  },
};

export default function ReplyModal({
  isOpen,
  onClose,
  onSend,
  theme = "love",
}: ReplyModalProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const config = (THEME_CONFIG as any)[theme] ?? THEME_CONFIG.love;
  const Icon = config.icon;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      await onSend(message);
      setStatus("success");
      setMessage("");
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-black/20 backdrop-blur-sm'
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className='relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden'>
            <div className='p-6 sm:p-8'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-serif text-gray-800 flex items-center gap-2'>
                  <Icon className={cn("w-5 h-5", config.color, config.fill)} />
                  Reply with Love
                </h2>
                <button
                  onClick={onClose}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                  aria-label='Close reply modal'>
                  <X className='w-5 h-5 text-gray-400' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='relative'>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Write your heart out...'
                    className={cn(
                      "w-full h-32 p-4 bg-paper rounded-2xl border-2 border-transparent outline-none resize-none transition-all duration-300 text-gray-700 placeholder:text-gray-300",
                      config.focus,
                    )}
                    disabled={status === "sending" || status === "success"}
                    aria-label='Your reply message'
                  />
                  <div className='absolute bottom-3 right-3 text-xs text-gray-300'>
                    {message.length} characters
                  </div>
                </div>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-red-500 text-sm text-center'
                    role='alert'>
                    {errorMessage}
                  </motion.p>
                )}

                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-sm text-center flex items-center justify-center gap-2",
                      config.success,
                    )}
                    role='status'>
                    Message sent successfully! ✨
                  </motion.p>
                )}

                <Button
                  type='submit'
                  className={cn(
                    "w-full flex items-center justify-center gap-2 text-white",
                    config.button,
                  )}
                  disabled={
                    !message.trim() ||
                    status === "sending" ||
                    status === "success"
                  }
                  aria-label={
                    status === "sending" ? "Sending message" : "Send reply"
                  }>
                  {status === "sending" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}>
                      <Icon className='w-4 h-4' />
                    </motion.div>
                  ) : (
                    <>
                      Send Reply
                      <Send className='w-4 h-4' />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
