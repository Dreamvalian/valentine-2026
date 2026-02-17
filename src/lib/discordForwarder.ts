import {
  analyzeEmotion,
  type EmotionAnalysis,
  type EmotionType,
} from "./emotion";

type ForwardResult = {
  ok: boolean;
  status: number;
  error?: string;
  emotion: EmotionAnalysis;
};

type RateWindow = {
  count: number;
  startedAt: number;
};

const globalWindow: RateWindow = {
  count: 0,
  startedAt: Date.now(),
};

const userWindows = new Map<string, RateWindow>();
const recentHashes = new Map<string, number>();

const WINDOW_MS = 60_000;
const GLOBAL_LIMIT = 30;
const USER_LIMIT = 10;
const DUP_WINDOW_MS = 30_000;

function hashContent(content: string, theme?: string): string {
  const base = (content || "").slice(0, 128) + "|" + (theme ?? "");
  let h = 0;
  for (let i = 0; i < base.length; i++) {
    h = (h << 5) - h + base.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function resetWindow(w: RateWindow) {
  const now = Date.now();
  if (now - w.startedAt > WINDOW_MS) {
    w.count = 0;
    w.startedAt = now;
  }
}

function checkRateLimit(userId: string, message: string, theme?: string) {
  resetWindow(globalWindow);
  if (globalWindow.count >= GLOBAL_LIMIT) {
    throw new Error("Global rate limit reached. Please try again later.");
  }

  let uw = userWindows.get(userId);
  if (!uw) {
    uw = { count: 0, startedAt: Date.now() };
    userWindows.set(userId, uw);
  }
  resetWindow(uw);
  if (uw.count >= USER_LIMIT) {
    throw new Error("You are sending messages too fast. Please slow down.");
  }

  const now = Date.now();
  const hash = hashContent(message, theme);
  const last = recentHashes.get(hash);
  if (last && now - last < DUP_WINDOW_MS) {
    throw new Error("This message looks like a duplicate and was filtered.");
  }
  recentHashes.set(hash, now);

  globalWindow.count += 1;
  uw.count += 1;
}

function sanitizeContent(message: string): string {
  const trimmed = message.trim();
  const limited =
    trimmed.length > 4000 ? trimmed.slice(0, 3997) + "..." : trimmed;
  return limited
    .replace(/@everyone/g, "@ everyone")
    .replace(/@here/g, "@ here");
}

function emotionColor(type: EmotionType): number {
  switch (type) {
    case "joy":
      return 0xffeb3b;
    case "sadness":
      return 0x64b5f6;
    case "anger":
      return 0xef5350;
    case "fear":
      return 0x9575cd;
    case "surprise":
      return 0xffb74d;
    case "love":
      return 0xf06292;
    case "loneliness":
      return 0x7986cb;
    case "anxiety":
      return 0x4db6ac;
    case "neutral":
    default:
      return 0xb0bec5;
  }
}

function formatEmotionSummary(analysis: EmotionAnalysis): string {
  const primary = `${analysis.primary.type} (${Math.round(analysis.primary.confidence * 100)}%)`;
  const secondary = analysis.scores
    .filter((s) => s.type !== analysis.primary.type && s.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
    .map((s) => `${s.type} ${Math.round(s.confidence * 100)}%`)
    .join(", ");

  const keywords =
    analysis.keywords.length > 0
      ? analysis.keywords.map((k) => `\`${k}\``).join(", ")
      : "none";

  return [
    `Primary: **${primary}**`,
    secondary ? `Also felt: ${secondary}` : "",
    `Keywords: ${keywords}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function postWithRetry(
  url: string,
  body: unknown,
  attempt = 1,
  maxAttempts = 3,
): Promise<Response> {
  const startedAt = Date.now();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const finishedAt = Date.now();
    console.log(
      JSON.stringify({
        event: "discord_webhook_success",
        status: res.status,
        attempt,
        durationMs: finishedAt - startedAt,
      }),
    );
    return res;
  }

  const status = res.status;
  const retryAfterHeader = res.headers.get("retry-after");
  const retryAfterMs = retryAfterHeader
    ? parseFloat(retryAfterHeader) * 1000
    : undefined;

  if (status === 429 && retryAfterMs && attempt < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
    return postWithRetry(url, body, attempt + 1, maxAttempts);
  }

  if (attempt < maxAttempts && status >= 500) {
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return postWithRetry(url, body, attempt + 1, maxAttempts);
  }

  return res;
}

async function sendToDiscordWebhook(
  webhookUrl: string,
  message: string,
  theme?: string,
  userId = "sugar",
  kind: "reply" | "mood" = "reply",
  originalMood?: string,
): Promise<ForwardResult> {
  const sanitized = sanitizeContent(message);
  const sanitizedOriginalMood = originalMood
    ? sanitizeContent(originalMood)
    : undefined;
  const emotion = analyzeEmotion(sanitized);

  try {
    checkRateLimit(userId, sanitized, theme);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({
        event: "discord_forward_rate_limited",
        error: message,
      }),
    );
    return {
      ok: false,
      status: 429,
      error: message,
      emotion,
    };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const embedTimestamp = new Date(timestamp * 1000).toISOString();

  const isMood = kind === "mood";
  const headerLine = isMood
    ? "💭 **Mood check-in from Sugar**"
    : "💌 **New emotional check-in from Sugar**";
  const title = isMood ? "💭 Mood check-in" : "💖 Envelope reply";

  const embedDescriptionLines = [
    headerLine,
    "",
    sanitized,
    "",
    `<t:${timestamp}:F>`,
  ];

  const fields =
    isMood && theme
      ? [
          {
            name: "Emotional context",
            value: formatEmotionSummary(emotion),
          },
          {
            name: "Envelope theme",
            value: `\`${theme}\``,
          },
        ]
      : !isMood && sanitizedOriginalMood
        ? [
            {
              name: "Original mood description",
              value: sanitizedOriginalMood,
            },
          ]
        : [];

  const payload = {
    content: "",
    embeds: [
      {
        title,
        description: embedDescriptionLines.join("\n"),
        color: emotionColor(emotion.primary.type),
        timestamp: embedTimestamp,
        fields,
      },
    ],
  };

  const startedAt = Date.now();
  try {
    const res = await postWithRetry(webhookUrl, payload);
    const finishedAt = Date.now();
    const ok = res.ok;
    const status = res.status;
    const errorText = ok ? undefined : await res.text();

    console.log(
      JSON.stringify({
        event: "discord_forward_result",
        ok,
        status,
        durationMs: finishedAt - startedAt,
      }),
    );

    return {
      ok,
      status,
      error: errorText,
      emotion,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const finishedAt = Date.now();
    console.error(
      JSON.stringify({
        event: "discord_forward_error",
        error: message,
        stack,
        durationMs: finishedAt - startedAt,
      }),
    );
    return {
      ok: false,
      status: 500,
      error: message,
      emotion,
    };
  }
}

export async function forwardEmotionalMessageToDiscord(
  message: string,
  theme?: string,
  userId = "sugar",
): Promise<ForwardResult> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    throw new Error(
      "Discord Webhook URL is not configured. Please add DISCORD_WEBHOOK_URL to environment variables.",
    );
  }

  return sendToDiscordWebhook(webhookUrl, message, theme, userId, "reply");
}

export async function forwardReplyToDiscord(
  message: string,
  theme?: string,
  userId = "sugar",
  originalMood?: string,
): Promise<ForwardResult> {
  const webhookUrl =
    process.env.DISCORD_REPLY_WEBHOOK_URL?.trim() ||
    process.env.DISCORD_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    throw new Error(
      "Discord reply webhook URL is not configured. Please add DISCORD_REPLY_WEBHOOK_URL or DISCORD_WEBHOOK_URL to environment variables.",
    );
  }

  return sendToDiscordWebhook(
    webhookUrl,
    message,
    theme,
    userId,
    "reply",
    originalMood,
  );
}

export async function forwardMoodToDiscord(
  message: string,
  theme?: string,
  userId = "sugar",
): Promise<ForwardResult> {
  const webhookUrl = process.env.DISCORD_MOOD_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    throw new Error(
      "Discord mood webhook URL is not configured. Please add DISCORD_MOOD_WEBHOOK_URL to environment variables.",
    );
  }

  return sendToDiscordWebhook(webhookUrl, message, theme, userId, "mood");
}
