import { describe, expect, it } from "vitest";
import { buildMessageLineage, type DiscordMessage } from "./discordLineage";

function msg(
  id: string,
  channel: string,
  ref?: DiscordMessage,
): DiscordMessage {
  return {
    id,
    channel_id: channel,
    author: { id: `user-${id}` },
    type: 19, // REPLY
    message_reference: ref
      ? { message_id: ref.id, channel_id: ref.channel_id }
      : undefined,
    referenced_message: ref ?? undefined,
  } as any;
}

describe("buildMessageLineage", () => {
  it("builds lineage for nested replies in same channel", async () => {
    const root = msg("1", "A");
    const mid = msg("2", "A", root);
    const top = msg("3", "A", mid);

    const res = await buildMessageLineage({ seedMessage: top });
    expect(res.lineage.map((h) => h.id)).toEqual(["3", "2", "1"]);
    expect(res.origin?.id).toBe("1");
    expect(res.incomplete).toBe(false);
  });

  it("handles cross-channel reply hops", async () => {
    const root = msg("10", "CHAN_X");
    const mid = msg("11", "CHAN_Y", root);
    const top = msg("12", "CHAN_Y", mid);

    const res = await buildMessageLineage({ seedMessage: top });
    expect(res.lineage.map((h) => h.via)).toEqual([
      "start",
      "reply",
      "cross_channel_reply",
    ]);
    expect(res.origin?.channel_id).toBe("CHAN_X");
  });

  it("marks incomplete when only IDs are present without fetcher", async () => {
    const rootRefOnly: DiscordMessage = {
      id: "21",
      channel_id: "C1",
      author: { id: "user-21" },
      message_reference: { message_id: "20", channel_id: "C1" },
      referenced_message: null,
    };
    const res = await buildMessageLineage({ seedMessage: rootRefOnly });
    expect(res.incomplete).toBe(true);
    expect(res.lineage[1]).toMatchObject({ id: "20", channel_id: "C1" });
  });
});
