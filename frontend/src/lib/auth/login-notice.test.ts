import { describe, expect, it } from "vitest";
import { getLoginNotice } from "./login-notice";

describe("getLoginNotice", () => {
  it("returns a re-login guide for an expired session", () => {
    expect(getLoginNotice("session-expired")).toBe(
      "로그인 시간이 만료되었습니다. 다시 로그인해 주세요.",
    );
  });

  it("does not expose a notice for an unknown reason", () => {
    expect(getLoginNotice("unknown")).toBeNull();
    expect(getLoginNotice(undefined)).toBeNull();
  });
});
