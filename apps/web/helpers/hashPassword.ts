/** SHA-256 hex digest that works in both browser and Node. */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const data = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // SSR / Node fallback
  const { createHash } = await import('crypto');
  return createHash('sha256').update(password).digest('hex');
}
