const ACCESS_TOKEN_KEY = "mini_social_access_token";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

