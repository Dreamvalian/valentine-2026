import { describe, expect, it } from "vitest";
import { analyzeEmotion } from "./emotion";

describe("analyzeEmotion", () => {
  it("returns neutral when no keywords are present", () => {
    const res = analyzeEmotion("Just a simple check-in without strong feelings.");
    expect(res.primary.type).toBe("neutral");
    expect(res.primary.confidence).toBe(1);
  });

  it("detects sadness", () => {
    const res = analyzeEmotion("I feel really sad and low today.");
    expect(res.primary.type).toBe("sadness");
    expect(res.primary.confidence).toBeGreaterThan(0.9);
    expect(res.keywords).toContain("sad");
  });

  it("detects anxiety", () => {
    const res = analyzeEmotion("I am anxious and overwhelmed about tomorrow.");
    expect(res.primary.type === "anxiety" || res.primary.type === "fear").toBe(
      true,
    );
    expect(res.keywords).toContain("anxious");
    expect(res.keywords).toContain("overwhelmed");
  });

  it("captures multiple emotions with different confidences", () => {
    const res = analyzeEmotion(
      "I am proud but also a bit nervous and scared about the future.",
    );
    const types = res.scores.map((s) => s.type);
    expect(types).toContain("joy");
    expect(types).toContain("fear");
  });
});

