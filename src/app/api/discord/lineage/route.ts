import { NextRequest, NextResponse } from "next/server";
import {
  buildMessageLineage,
  discordRestFetcher,
  type DiscordMessage,
} from "@/lib/discordLineage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, seedMessage, channelId, messageId, maxDepth } = body as {
      token?: string;
      seedMessage?: DiscordMessage;
      channelId?: string;
      messageId?: string;
      maxDepth?: number;
    };

    if (!seedMessage && (!token || !channelId || !messageId)) {
      return NextResponse.json(
        { error: "Provide seedMessage or token+channelId+messageId" },
        { status: 400 },
      );
    }

    const result = await buildMessageLineage({
      seedMessage,
      seedIds: channelId && messageId ? { channelId, messageId } : undefined,
      token,
      fetcher: token ? discordRestFetcher : undefined,
      maxDepth,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: 500 },
    );
  }
}

