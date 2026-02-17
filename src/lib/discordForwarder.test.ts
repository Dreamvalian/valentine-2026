import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  forwardEmotionalMessageToDiscord,
  forwardMoodToDiscord,
  forwardReplyToDiscord,
} from "./discordForwarder";

describe("forwardEmotionalMessageToDiscord", () => {
  const originalEnv = process.env.DISCORD_WEBHOOK_URL;

  afterEach(() => {
    process.env.DISCORD_WEBHOOK_URL = originalEnv;
    vi.restoreAllMocks();
  });

  it("throws when webhook url is missing", async () => {
    delete process.env.DISCORD_WEBHOOK_URL;
    await expect(
      forwardEmotionalMessageToDiscord("Hello", "loveReminder"),
    ).rejects.toThrow(/Discord Webhook URL is not configured/);
  });

  it("sends payload and returns ok on success", async () => {
    process.env.DISCORD_WEBHOOK_URL = "https://discord.test/webhook";

    const fetchResponse: Response = {
      ok: true,
      status: 204,
      headers: new Headers(),
      text: async () => "",
    } as Response;
    const fetchMock = vi.fn().mockResolvedValue(fetchResponse);
    // @ts-expect-error - override global fetch for test environment
    global.fetch = fetchMock;

    const res = await forwardEmotionalMessageToDiscord(
      "I feel really sad but also a bit hopeful.",
      "loveReminder",
    );

    expect(res.ok).toBe(true);
    expect(res.status).toBe(204);
    expect(res.emotion.primary).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("applies rate limiting for duplicate messages", async () => {
    process.env.DISCORD_WEBHOOK_URL = "https://discord.test/webhook";
    const fetchResponse: Response = {
      ok: true,
      status: 204,
      headers: new Headers(),
      text: async () => "",
    } as Response;
    const fetchMock = vi.fn().mockResolvedValue(fetchResponse);
    // @ts-expect-error - override global fetch for test environment
    global.fetch = fetchMock;

    await forwardEmotionalMessageToDiscord(
      "I feel lonely.",
      "lonely",
      "user-1",
    );
    await expect(
      forwardEmotionalMessageToDiscord("I feel lonely.", "lonely", "user-1"),
    ).resolves.toMatchObject({ ok: false });
  });
});

describe("forwardReplyToDiscord and forwardMoodToDiscord", () => {
  const originalReply = process.env.DISCORD_REPLY_WEBHOOK_URL;
  const originalMood = process.env.DISCORD_MOOD_WEBHOOK_URL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.DISCORD_REPLY_WEBHOOK_URL = originalReply;
    process.env.DISCORD_MOOD_WEBHOOK_URL = originalMood;
    vi.restoreAllMocks();
  });

  it("sends reply to reply webhook url", async () => {
    process.env.DISCORD_REPLY_WEBHOOK_URL = "https://discord.test/reply";

    const fetchResponse: Response = {
      ok: true,
      status: 204,
      headers: new Headers(),
      text: async () => "",
    } as Response;
    const fetchMock = vi.fn().mockResolvedValue(fetchResponse);
    // @ts-expect-error - override global fetch for test environment
    global.fetch = fetchMock;

    const res = await forwardReplyToDiscord(
      "Thank you for reading this.",
      "loveReminder",
      "user-123",
      "She felt a little anxious earlier.",
    );

    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://discord.test/reply");
  });

  it("sends mood to mood webhook url", async () => {
    process.env.DISCORD_MOOD_WEBHOOK_URL = "https://discord.test/mood";

    const fetchResponse: Response = {
      ok: true,
      status: 204,
      headers: new Headers(),
      text: async () => "",
    } as Response;
    const fetchMock = vi.fn().mockResolvedValue(fetchResponse);
    // @ts-expect-error - override global fetch for test environment
    global.fetch = fetchMock;

    const res = await forwardMoodToDiscord(
      "Feeling a bit anxious but hopeful.",
      "cantSleep",
      "user-456",
    );

    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://discord.test/mood");
  });
});
