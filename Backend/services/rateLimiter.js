// rateLimiter.js (new file, if not already created)
const REQUEST_LIMIT_PER_MIN = 90;   // margin under the 100 RPM cap
const TOKEN_LIMIT_PER_MIN = 27000;  // margin under the 30,000 TPM cap
const WINDOW_MS = 60 * 1000;

let requestLog = [];

const purgeOldEntries = () => {
  const cutoff = Date.now() - WINDOW_MS;
  requestLog = requestLog.filter((entry) => entry.timestamp > cutoff);
};

export const waitForCapacity = async (upcomingTokens) => {
  while (true) {
    purgeOldEntries();
    const currentRequests = requestLog.length;
    const currentTokens = requestLog.reduce((sum, e) => sum + e.tokens, 0);

    if (currentRequests < REQUEST_LIMIT_PER_MIN && currentTokens + upcomingTokens <= TOKEN_LIMIT_PER_MIN) {
      return;
    }

    const oldest = requestLog[0];
    const waitMs = oldest ? Math.max(oldest.timestamp + WINDOW_MS - Date.now(), 2000) : 2000;
    console.warn(`Pacing: ${currentRequests}/${REQUEST_LIMIT_PER_MIN} req, ${currentTokens}/${TOKEN_LIMIT_PER_MIN} tokens used. Waiting ${Math.round(waitMs / 1000)}s...`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
};

export const recordRequest = (tokens) => {
  requestLog.push({ timestamp: Date.now(), tokens });
};