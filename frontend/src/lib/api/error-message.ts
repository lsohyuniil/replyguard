const NETWORK_ERROR_MESSAGE =
  "인터넷 연결이 원활하지 않습니다. 연결 상태를 확인해 주세요.";
const FORBIDDEN_ERROR_MESSAGE = "이 정보를 확인할 권한이 없습니다.";
const SERVICE_ERROR_MESSAGE =
  "서비스가 일시적으로 원활하지 않습니다. 잠시 후 다시 시도해 주세요.";
const DEFAULT_ERROR_MESSAGE =
  "현재 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.";

export function getUserFacingErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return NETWORK_ERROR_MESSAGE;
  }

  const status = getErrorStatus(error);
  if (status === 403) {
    return FORBIDDEN_ERROR_MESSAGE;
  }

  if (status !== null && status >= 500) {
    return SERVICE_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}

function getErrorStatus(error: unknown): number | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return null;
}

