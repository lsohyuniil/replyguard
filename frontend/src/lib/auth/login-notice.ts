const SESSION_EXPIRED_NOTICE =
  "로그인 시간이 만료되었습니다. 다시 로그인해 주세요.";

export function getLoginNotice(
  reason: string | string[] | undefined,
): string | null {
  return reason === "session-expired" ? SESSION_EXPIRED_NOTICE : null;
}
