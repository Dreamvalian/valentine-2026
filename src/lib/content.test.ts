import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EMOTIONAL_LETTER_TAGS,
  EMOTIONAL_LETTERS,
  EmotionalLetterTheme,
  getRandomLetter,
} from "./content";

describe("getRandomLetter", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a non-empty string for a valid theme without tag", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const letter = getRandomLetter("sad");
    expect(typeof letter).toBe("string");
    expect(letter.length).toBeGreaterThan(0);
    const [firstLine] = EMOTIONAL_LETTERS.sad[0];
    expect(letter).toContain(firstLine);
  });

  it("respects tag filtering when tag exists for theme", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const theme: EmotionalLetterTheme = "cantSleep";
    const tag = EMOTIONAL_LETTER_TAGS[theme][0];
    const letter = getRandomLetter(theme, tag);
    const [firstLine] = EMOTIONAL_LETTERS[theme][0];
    expect(letter).toContain(firstLine);
  });

  it("throws when tag is not associated with the theme", () => {
    expect(() => getRandomLetter("happy", "night")).toThrowError(
      /No content for theme "happy" with tag "night"/,
    );
  });

  it("throws when theme has no configured letters", () => {
    const theme = "sad" as EmotionalLetterTheme;
    const original = EMOTIONAL_LETTERS[theme];
    // @ts-expect-error - intentionally mutating for test
    EMOTIONAL_LETTERS[theme] = [];

    expect(() => getRandomLetter(theme)).toThrowError(
      /No letters configured for theme "sad"/,
    );

    // restore
    // @ts-expect-error - restoring original value
    EMOTIONAL_LETTERS[theme] = original;
  });

  it("throws when a selected letter is empty", () => {
    const theme = "happy" as EmotionalLetterTheme;
    const original = EMOTIONAL_LETTERS[theme];
    // @ts-expect-error - intentionally mutating for test
    EMOTIONAL_LETTERS[theme] = [[]];

    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(() => getRandomLetter(theme)).toThrowError(
      /Selected letter for theme "happy" is empty/,
    );

    // restore
    // @ts-expect-error - restoring original value
    EMOTIONAL_LETTERS[theme] = original;
  });
});
