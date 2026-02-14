export type DiscordUser = {
  id: string;
  username?: string;
};

export type DiscordMessageReference = {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
};

export type DiscordMessage = {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: DiscordUser;
  type?: number;
  message_reference?: DiscordMessageReference;
  referenced_message?: DiscordMessage | null;
};

export type LineageHop = {
  id: string;
  channel_id: string;
  guild_id?: string;
  author_id: string;
  type?: number;
  via: "start" | "reply" | "cross_channel_reply" | "unresolved";
};

export type FetchMessageParams = {
  token: string;
  channelId: string;
  messageId: string;
};

export type MessageFetcher = (
  params: FetchMessageParams,
) => Promise<DiscordMessage | null>;

export async function discordRestFetcher(
  params: FetchMessageParams,
): Promise<DiscordMessage | null> {
  const { token, channelId, messageId } = params;
  const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  } as RequestInit);
  if (!res.ok) return null;
  const data = (await res.json()) as DiscordMessage;
  return data;
}

export type BuildLineageOptions = {
  seedMessage?: DiscordMessage;
  seedIds?: { channelId: string; messageId: string };
  token?: string;
  fetcher?: MessageFetcher;
  maxDepth?: number;
};

export type LineageResult = {
  lineage: LineageHop[];
  origin?: LineageHop;
  incomplete: boolean;
};

export async function buildMessageLineage(
  opts: BuildLineageOptions,
): Promise<LineageResult> {
  const maxDepth = opts.maxDepth ?? 25;
  const fetcher = opts.fetcher ?? (opts.token ? discordRestFetcher : undefined);
  let current: DiscordMessage | null = opts.seedMessage ?? null;

  if (!current && opts.seedIds && fetcher && opts.token) {
    current = await fetcher({
      token: opts.token,
      channelId: opts.seedIds.channelId,
      messageId: opts.seedIds.messageId,
    });
  }

  if (!current) {
    return { lineage: [], origin: undefined, incomplete: true };
  }

  const lineage: LineageHop[] = [];
  let depth = 0;
  let incomplete = false;

  const pushHop = (msg: DiscordMessage, via: LineageHop["via"]) => {
    lineage.push({
      id: msg.id,
      channel_id: msg.channel_id,
      guild_id: msg.guild_id,
      author_id: msg.author.id,
      type: msg.type,
      via,
    });
  };

  pushHop(current, "start");

  // Follow referenced_message or message_reference chain
  while (depth++ < maxDepth) {
    const ref = current.message_reference;
    const deep = current.referenced_message;

    if (deep && deep.id) {
      const via: LineageHop["via"] =
        deep.channel_id !== current.channel_id
          ? "cross_channel_reply"
          : "reply";
      pushHop(deep, via);
      current = deep;
      continue;
    }

    if (ref && ref.message_id && ref.channel_id) {
      if (!fetcher || !opts.token) {
        // We know the IDs but cannot fetch the message content; mark as incomplete
        lineage.push({
          id: ref.message_id,
          channel_id: ref.channel_id,
          guild_id: ref.guild_id,
          author_id: "unknown",
          type: undefined,
          via: ref.channel_id !== current.channel_id
            ? "cross_channel_reply"
            : "reply",
        });
        incomplete = true;
        break;
      }
      const next = await fetcher({
        token: opts.token!,
        channelId: ref.channel_id,
        messageId: ref.message_id,
      });
      if (!next) {
        lineage.push({
          id: ref.message_id,
          channel_id: ref.channel_id,
          guild_id: ref.guild_id,
          author_id: "unknown",
          type: undefined,
          via: ref.channel_id !== current.channel_id
            ? "cross_channel_reply"
            : "reply",
        });
        incomplete = true;
        break;
      }
      const via: LineageHop["via"] =
        next.channel_id !== current.channel_id
          ? "cross_channel_reply"
          : "reply";
      pushHop(next, via);
      current = next;
      continue;
    }

    // No more references
    break;
  }

  return { lineage, origin: lineage[lineage.length - 1], incomplete };
}

