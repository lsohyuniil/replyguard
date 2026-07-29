import { describe, expect, it } from "vitest";
import { createSessionExpiredLoginUrl } from "./login-redirect";

describe("createSessionExpiredLoginUrl", () => {
  it("redirects a protected page to login with the expiry reason", () => {
    expect(
      createSessionExpiredLoginUrl(
        "http://localhost:3000/inquiries?page=2",
      ).toString(),
    ).toBe(
      "http://localhost:3000/login?reason=session-expired",
    );
  });
});

