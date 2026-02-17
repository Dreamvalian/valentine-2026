export type EmotionType =
  | "joy"
  | "sadness"
  | "anger"
  | "fear"
  | "surprise"
  | "love"
  | "loneliness"
  | "anxiety"
  | "neutral";

export type EmotionScore = {
  type: EmotionType;
  confidence: number;
};

export type EmotionAnalysis = {
  primary: EmotionScore;
  scores: EmotionScore[];
  keywords: string[];
};

const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  joy: [
    "happy",
    "joy",
    "excited",
    "grateful",
    "thankful",
    "proud",
    "relieved",
  ],
  sadness: ["sad", "down", "low", "depressed", "heartbroken", "blue"],
  anger: ["angry", "mad", "upset", "furious", "annoyed", "frustrated"],
  fear: ["afraid", "scared", "terrified", "worried", "nervous"],
  surprise: ["surprised", "shocked", "unexpected"],
  love: ["love", "loving", "adore", "caring", "attached"],
  loneliness: ["lonely", "alone", "isolated", "left out"],
  anxiety: [
    "anxious",
    "anxiety",
    "stressed",
    "overwhelmed",
    "panic",
    "tension",
  ],
  neutral: [],
};

export function analyzeEmotion(text: string): EmotionAnalysis {
  const value = text.toLowerCase();
  const scores: EmotionScore[] = [];
  const matchedKeywords: string[] = [];

  Object.entries(EMOTION_KEYWORDS).forEach(([type, words]) => {
    let score = 0;
    words.forEach((w) => {
      if (value.includes(w)) {
        score += 1;
        matchedKeywords.push(w);
      }
    });
    scores.push({ type: type as EmotionType, confidence: score });
  });

  const maxScore = scores.reduce((m, s) => (s.confidence > m ? s.confidence : m), 0);
  const normalized =
    maxScore === 0
      ? scores.map((s) =>
          s.type === "neutral" ? { ...s, confidence: 1 } : { ...s, confidence: 0 },
        )
      : scores.map((s) => ({
          type: s.type,
          confidence: s.confidence / maxScore,
        }));

  const primary =
    normalized.find((s) => s.confidence === 1) ??
    normalized.find((s) => s.type === "neutral")!;

  return {
    primary,
    scores: normalized,
    keywords: Array.from(new Set(matchedKeywords)),
  };
}

