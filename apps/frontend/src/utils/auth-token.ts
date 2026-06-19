const STORAGE_KEY = "access-token";

let _accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getAccessToken(): string | null {
  if (_accessToken) {
    return _accessToken;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    _accessToken = stored;
    return stored;
  }
  return null;
}
