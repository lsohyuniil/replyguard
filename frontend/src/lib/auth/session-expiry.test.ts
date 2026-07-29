import { describe, expect, it, vi } from "vitest";
import {
  createSessionExpiryHandler,
  SESSION_EXPIRED_LOGIN_URL,
} from "./session-expiry";

describe("createSessionExpiryHandler", () => {
  it("signs out and redirects only once when concurrent requests expire", async () => {
    let finishSignOut: (() => void) | undefined;
    const signOut = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishSignOut = resolve;
        }),
    );
    const navigate = vi.fn();
    const handleSessionExpiry = createSessionExpiryHandler({
      signOut,
      navigate,
    });

    const first = handleSessionExpiry();
    const second = handleSessionExpiry();
    finishSignOut?.();
    await Promise.all([first, second]);

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(SESSION_EXPIRED_LOGIN_URL);
  });
});

