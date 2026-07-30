import {
  AuthenticationRequiredError,
  createSingleFlight,
  requestWithAuth,
} from "@/lib/api/authenticated-request";
import { createSessionExpiryHandler } from "@/lib/auth/session-expiry";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const developmentApiBaseUrl = "http://127.0.0.1:8000";
const refreshAccessToken = createSingleFlight(async () => {
  const { data } =
    await createBrowserSupabaseClient().auth.refreshSession();
  return data.session?.access_token ?? null;
});
const handleSessionExpiry = createSessionExpiryHandler({
  signOut: () =>
    createBrowserSupabaseClient().auth.signOut({ scope: "local" }),
  navigate: (url) => window.location.replace(url),
});

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
  const supabase = createBrowserSupabaseClient();
  let response: Response;

  try {
    response = await requestWithAuth(
      `${getApiBaseUrl()}${path}`,
      {
        ...init,
        headers: {
          Accept: "application/json",
          ...init?.headers,
        },
      },
      {
        fetcher: window.fetch.bind(window),
        getAccessToken: async () => {
          const { data } = await supabase.auth.getSession();
          return data.session?.access_token ?? null;
        },
        refreshAccessToken,
      },
    );
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      await handleSessionExpiry();
      throw new ApiError("로그인이 필요합니다.", 401);
    }
    throw error;
  }

  if (response.status === 401) {
    await handleSessionExpiry();
    throw new ApiError("로그인이 필요합니다.", 401);
  }

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
