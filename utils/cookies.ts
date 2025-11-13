// utils/cookies.ts (or wherever that helper lives)
export function parseCookieJson<T = unknown>(raw: string | undefined | null): T | null {
  if (!raw) return null;

  try {
    let value = raw;

    // Handle the "base64-<payload>" format
    if (value.startsWith('base64-')) {
      const b64 = value.slice('base64-'.length);

      // atob is available in the browser; on the server use Buffer
      if (typeof atob === 'function') {
        value = atob(b64);
      } else {
        value = Buffer.from(b64, 'base64').toString('utf8');
      }
    }

    return JSON.parse(value) as T;
  } catch (err) {
    console.warn('Failed to parse cookie string', err, { raw });
    return null;
  }
}
