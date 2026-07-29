import { describe, expect, it } from "vitest";
import { getUserFacingErrorMessage } from "./error-message";

describe("getUserFacingErrorMessage", () => {
  it("guides the user to check their internet connection for a network failure", () => {
    expect(getUserFacingErrorMessage(new TypeError("Failed to fetch"))).toBe(
      "인터넷 연결이 원활하지 않습니다. 연결 상태를 확인해 주세요.",
    );
  });

  it("explains an access restriction without treating it as a session expiry", () => {
    expect(getUserFacingErrorMessage({ status: 403 })).toBe(
      "이 정보를 확인할 권한이 없습니다.",
    );
  });

  it("asks the user to try later when the service is unavailable", () => {
    expect(getUserFacingErrorMessage({ status: 503 })).toBe(
      "서비스가 일시적으로 원활하지 않습니다. 잠시 후 다시 시도해 주세요.",
    );
  });

  it("uses a neutral message for an unknown lookup failure", () => {
    expect(getUserFacingErrorMessage(new Error("unknown"))).toBe(
      "현재 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.",
    );
  });
});

