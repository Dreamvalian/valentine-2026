import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();

    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not defined in environment variables");
      return NextResponse.json(
        { error: "Discord Webhook URL is not configured. Please add DISCORD_WEBHOOK_URL to your environment variables." },
        { status: 500 },
      );
    }

    // Discord message limits: description max 4096 chars
    const truncatedMessage = message.length > 4000 ? message.substring(0, 3997) + "..." : message;

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "💌 You've got a new reply!",
        embeds: [
          {
            title: "💖 New reply!",
            description: truncatedMessage,
            color: 0xffb6c1, // Light pink
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!discordResponse.ok) {
      const errorData = await discordResponse.text();
      console.error("Discord API error:", errorData);
      
      let errorMessage = "Failed to send message to Discord";
      try {
        const discordError = JSON.parse(errorData);
        if (discordError.message) {
          errorMessage = `Discord API error: ${discordError.message}`;
        }
      } catch (e) {
        // Fallback if errorData is not JSON
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: discordResponse.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in reply API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
