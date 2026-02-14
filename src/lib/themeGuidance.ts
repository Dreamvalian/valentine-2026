import { EnvelopeTheme } from "@/components/Envelope";

export type GuidanceAccent = {
  textClass: string;
  hex: string;
};

export const GUIDANCE_ACCENTS: Record<EnvelopeTheme, GuidanceAccent> = {
  love: { textClass: "text-pink-700", hex: "#be185d" },
  lonely: { textClass: "text-indigo-700", hex: "#4338ca" },
  sad: { textClass: "text-blue-700", hex: "#1d4ed8" },
  angry: { textClass: "text-orange-700", hex: "#c2410c" },
  happy: { textClass: "text-amber-800", hex: "#92400e" },
  miss: { textClass: "text-violet-700", hex: "#6d28d9" },
  excited: { textClass: "text-fuchsia-700", hex: "#a21caf" },
  nice: { textClass: "text-teal-700", hex: "#0f766e" },
  cantSleep: { textClass: "text-purple-800", hex: "#5b21b6" },
  loveReminder: { textClass: "text-rose-700", hex: "#be123c" },
  bored: { textClass: "text-gray-700", hex: "#374151" },
  proud: { textClass: "text-emerald-700", hex: "#047857" },
  grateful: { textClass: "text-green-700", hex: "#15803d" },
};

export function getGuidanceAccent(theme?: EnvelopeTheme): GuidanceAccent {
  if (!theme) return GUIDANCE_ACCENTS.love;
  return GUIDANCE_ACCENTS[theme] ?? GUIDANCE_ACCENTS.love;
}
