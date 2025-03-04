import { Scraper } from "agent-twitter-client";
import env from "../env";

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
