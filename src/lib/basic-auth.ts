import { createHash, timingSafeEqual } from "node:crypto";

// Server-only production access gate. Never import this into client components.
export function hasValidBasicAuth(authorization: string | null): boolean {
  const match = authorization?.match(/^Basic ([A-Za-z0-9+/]+={0,2})$/i);
  if (!match) return false;

  const credentials = Buffer.from(match[1], "base64");
  const expected = Buffer.from("admin:commerce-cockpit", "utf8");
  return timingSafeEqual(
    createHash("sha256").update(credentials).digest(),
    createHash("sha256").update(expected).digest(),
  );
}
