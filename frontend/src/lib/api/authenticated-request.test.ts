import { describe, expect, it, vi } from "vitest";
import {
  AuthenticationRequiredError,
  createSingleFlight,
  requestWithAuth,
} from "./authenticated-request";

describe("requestWithAuth", () => {
  it("adds the current access token to the request", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response("{}", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await requestWithAuth("/inquiries", undefined, {
      fetcher,
      getAccessToken: async () => "current-token",
      refreshAccessToken: async () => null,
    });

    const request = fetcher.mock.calls[0][1];
    expect(new Headers(request?.headers).get("Authorization")).toBe(
      "Bearer current-token",
    );
  });

  it("calls the fetch implementation without changing its receiver", async () => {
    const receivedReceivers: unknown[] = [];
    const fetcher = function (this: unknown) {
      receivedReceivers.push(this);
      return Promise.resolve(new Response("{}", { status: 200 }));
    } as typeof fetch;

    await requestWithAuth("/inquiries", undefined, {
      fetcher,
      getAccessToken: async () => "current-token",
      refreshAccessToken: async () => null,
    });

    expect(receivedReceivers).toEqual([undefined]);
  });

  it("refreshes once and retries after an unauthorized response", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const response = await requestWithAuth("/inquiries", undefined, {
      fetcher,
      getAccessToken: async () => "expired-token",
      refreshAccessToken: async () => "refreshed-token",
    });

    expect(response.status).toBe(200);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(
      new Headers(fetcher.mock.calls[1][1]?.headers).get("Authorization"),
    ).toBe("Bearer refreshed-token");
  });

  it("stops before the request when there is no session", async () => {
    const fetcher = vi.fn<typeof fetch>();

    await expect(
      requestWithAuth("/inquiries", undefined, {
        fetcher,
        getAccessToken: async () => null,
        refreshAccessToken: async () => null,
      }),
    ).rejects.toBeInstanceOf(AuthenticationRequiredError);
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("createSingleFlight", () => {
  it("shares one in-flight refresh across concurrent callers", async () => {
    let resolveRefresh: ((token: string) => void) | undefined;
    const refresh = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveRefresh = resolve;
        }),
    );
    const sharedRefresh = createSingleFlight(refresh);

    const first = sharedRefresh();
    const second = sharedRefresh();
    resolveRefresh?.("refreshed-token");

    await expect(Promise.all([first, second])).resolves.toEqual([
      "refreshed-token",
      "refreshed-token",
    ]);
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
