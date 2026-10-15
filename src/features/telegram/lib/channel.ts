import "server-only";

// Telegram usernames: 5–32 chars, start with a letter
const CHANNEL_USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{4,31}$/;

/** TELEGRAM_CHANNEL accepts "parztech", "@parztech" or a t.me link */
function resolveTelegramChannel() {
  const raw = process.env.TELEGRAM_CHANNEL?.trim();
  if (!raw) return null;

  const username = raw.replace(/^(https?:\/\/)?t\.me\//, "").replace(/^@/, "");
  if (!CHANNEL_USERNAME_PATTERN.test(username)) {
    console.error("TELEGRAM_CHANNEL is not a valid channel username");
    return null;
  }
  return { username, url: `https://t.me/${username}` };
}

export const telegramChannel = resolveTelegramChannel();
