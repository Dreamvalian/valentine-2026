import { describe, it, expect } from "vitest";
import { GUIDANCE_ACCENTS } from "./themeGuidance";

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  const R = toLin(r);
  const G = toLin(g);
  const B = toLin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fgHex: string, bgHex: string): number {
  const L1 = luminance(fgHex);
  const L2 = luminance(bgHex);
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Theme guidance contrast compliance", () => {
  it("all guidance colors have at least 4.5:1 contrast on white", () => {
    const bg = "#ffffff";
    Object.values(GUIDANCE_ACCENTS).forEach(({ hex }) => {
      const ratio = contrastRatio(hex, bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});

