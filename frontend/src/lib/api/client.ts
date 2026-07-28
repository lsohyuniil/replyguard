const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const developmentApiBaseUrl = "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError("요청을 처리하지 못했습니다.", response.status);
  }

  return response.json() as Promise<T>;
}

function getApiBaseUrl() {
  const apiBaseUrl =
    configuredApiBaseUrl ??
    (process.env.NODE_ENV === "development"
      ? developmentApiBaseUrl
      : undefined);

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.",
    );
  }

  return apiBaseUrl.replace(/\/$/, "");
}
