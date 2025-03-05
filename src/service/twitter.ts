import { Scraper, SearchMode } from "agent-twitter-client";
import env from "../env";
import db, { schema } from "../drizzle";
import { eq } from "drizzle-orm";
import { generateKoalaImage } from "./agent";

const scraper = new Scraper();
const cookies: string[] = [];
env.TWITTER_COOKIES.map((c: any) => {
  const cookie = `${c.name}=${c.value}; Domain=${c.domain}; Path=${c.path}; Secure; SameSite=${c.sameSite}; Expires=${new Date(c.expirationDate * 1000).toUTCString()}`;
  cookies.push(cookie);
});
await scraper.setCookies(cookies);

if (!(await scraper.isLoggedIn())) {
  throw new Error("Failed to login to Twitter");
}

const profile = await scraper.getProfile(env.TWITTER_USERNAME);

console.log("Logged in to Twitter as " + profile.username);

// if (media) {
// 	const mediaRes = await fetch(media);
// 	const mediaBuffer = await mediaRes.arrayBuffer();
// 	const mediaType = mediaRes.headers.get("content-type") || "image/jpeg";
//
// 	mediaData.push({
// 		data: Buffer.from(mediaBuffer),
// 		mediaType
// 	});
// }

// await scraper.sendTweet(tweet, undefined, mediaData);

async function handleReply({
  command,
  text,
  tweetId,
}: {
  command: string;
  text: string;
  tweetId: string;
}) {
  if (command === "koala") {
    const res = await generateKoalaImage(text);
    if (!res.imageUrl) throw new Error("Failed to generate image");

    const mediaRes = await fetch(res.imageUrl);
    const mediaBuffer = await mediaRes.arrayBuffer();
    const mediaType = mediaRes.headers.get("content-type") || "image/jpeg";

    await scraper.sendTweet("", tweetId, [
      {
        data: Buffer.from(mediaBuffer),
        mediaType,
      },
    ]);
  } else if (command === "rogue") {
  }
}

let checkLatestMentionRunning = false;

export async function checkLatestMention() {
  try {
    if (checkLatestMentionRunning) return;
    checkLatestMentionRunning = true;

    const services = await db.select().from(schema.service);

    const mentions = await scraper.fetchSearchTweets(
      `@${env.TWITTER_USERNAME}`,
      10,
      SearchMode.Latest,
    );
    for (let mention of mentions.tweets) {
      const [saved] = await db
        .select()
        .from(schema.tweet)
        .where(eq(schema.tweet.id, mention.id!));
      if (saved) continue;

      const service = services.find((s: any) =>
        mention.text?.includes(`/${s.data.command}`),
      );
      if (!service) {
        const reply = `Here are the available services: \n${services.map((s: any) => `/${s.data.command}${s.data.twitter ? ` (@${s.data.twitter})` : ""} - ${s.data.name}`).join("\n")}`;
        await scraper.sendTweet(reply, mention.id);
      } else {
        const text = mention.text
          ?.toLowerCase()
          .replace(`/${service.data.command}`, "")
          .replace(`@${env.TWITTER_USERNAME}`, "")
          .trim();
        if (!text) {
          await scraper.sendTweet(
            "Please provide a text message to use this service",
            mention.id!,
          );
        } else {
          await handleReply({
            command: service.data.command,
            text,
            tweetId: mention.id!,
          });
        }
      }

      await db.insert(schema.tweet).values({
        id: mention.id!,
        serviceId: service?.id || null,
      });
    }
  } catch (e) {
    console.log(e);
  } finally {
    checkLatestMentionRunning = false;
  }
}

setInterval(checkLatestMention, 1000 * 5);
