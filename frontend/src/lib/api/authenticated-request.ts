type AuthRequestDependencies = {
  fetcher: typeof fetch;
  getAccessToken: () => Promise<string | null>;
  refreshAccessToken: () => Promise<string | null>;
};

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("로그인이 필요합니다.");
    this.name = "AuthenticationRequiredError";
  }
}

export function createSingleFlight<T>(operation: () => Promise<T>) {
  let inFlight: Promise<T> | null = null;

  return function run(): Promise<T> {
    if (!inFlight) {
      inFlight = operation().finally(() => {
        inFlight = null;
      });
    }
    return inFlight;
  };
}

export async function requestWithAuth(
  input: string,
  init: RequestInit | undefined,
  dependencies: AuthRequestDependencies,
): Promise<Response> {
  const fetcher = dependencies.fetcher;
  const accessToken = await dependencies.getAccessToken();
  if (!accessToken) {
    throw new AuthenticationRequiredError();
  }

  const response = await fetcher(
    input,
    withAccessToken(init, accessToken),
  );
  if (response.status !== 401) {
    return response;
  }

  const refreshedToken = await dependencies.refreshAccessToken();
  if (!refreshedToken) {
    throw new AuthenticationRequiredError();
  }

  return fetcher(
    input,
    withAccessToken(init, refreshedToken),
  );
}

function withAccessToken(
  init: RequestInit | undefined,
  accessToken: string,
): RequestInit {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  return {
    ...init,
    headers,
  };
}
