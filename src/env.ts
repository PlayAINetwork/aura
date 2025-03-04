const { NODE_ENV, TWITTER_USERNAME, TWITTER_COOKIES, DATABASE_URL } =
  process.env;

if (!TWITTER_USERNAME || !TWITTER_COOKIES) {
  throw new Error(
    "Environment variables TWITTER_USERNAME and TWITTER_COOKIES are not set",
  );
}

if (NODE_ENV !== "local" && !DATABASE_URL) {
  throw new Error("Environment variable DATABASE_URL is not set");
}

export default {
  NODE_ENV: NODE_ENV || "local",
  TWITTER_USERNAME,
  TWITTER_COOKIES: JSON.parse(TWITTER_COOKIES),
  DATABASE_URL,
};
