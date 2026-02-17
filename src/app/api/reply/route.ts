import {
  forwardMoodToDiscord,
  forwardReplyToDiscord,
} from "@/lib/discordForwarder";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, theme, consent, mood } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (consent === false) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const themeValue = theme ? String(theme) : undefined;
    const messageValue = String(message);
    const moodValue =
      typeof mood === "string" && mood.trim().length > 0 ? mood : undefined;

    const moodResult = moodValue
      ? await forwardMoodToDiscord(moodValue, themeValue, "sugar")
      : undefined;

    const replyResult = await forwardReplyToDiscord(
      messageValue,
      themeValue,
      "sugar",
      moodValue,
    );

    if (!replyResult.ok || (moodResult && !moodResult.ok)) {
      return NextResponse.json(
        {
          success: false,
          mood: moodResult,
          reply: replyResult,
          error:
            replyResult.error ??
            moodResult?.error ??
            "Failed to send one or more messages to Discord",
        },
        {
          status: !replyResult.ok
            ? replyResult.status
            : moodResult
              ? moodResult.status
              : 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      mood: moodResult,
      reply: replyResult,
      emotion: replyResult.emotion,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
