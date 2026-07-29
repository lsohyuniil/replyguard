import { SESSION_EXPIRED_LOGIN_URL } from "./session-expiry";

export function createSessionExpiredLoginUrl(
  currentUrl: string | URL,
): URL {
  return new URL(SESSION_EXPIRED_LOGIN_URL, currentUrl);
}

