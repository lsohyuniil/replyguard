export const SESSION_EXPIRED_LOGIN_URL =
  "/login?reason=session-expired";

type SessionExpiryDependencies = {
  signOut: () => Promise<unknown>;
  navigate: (url: string) => void;
};

export function createSessionExpiryHandler({
  signOut,
  navigate,
}: SessionExpiryDependencies) {
  let handling: Promise<void> | null = null;

  return function handleSessionExpiry(): Promise<void> {
    if (!handling) {
      handling = (async () => {
        try {
          await signOut();
        } finally {
          navigate(SESSION_EXPIRED_LOGIN_URL);
        }
      })();
    }

    return handling;
  };
}

