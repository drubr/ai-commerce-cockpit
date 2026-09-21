import "server-only";
import { cache } from "react";
import { requireSession } from "@/lib/session";

/** Read display data from the authenticated user; never expose session tokens. */
export const getCurrentUser = cache(async () => {
  const { user } = await requireSession();
  const name = user.name.trim() || user.email;
  const parts = name.split(/\s+/);
  const firstName = parts[0];
  const initials = (
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.slice(0, 2)
  ).toLocaleUpperCase();

  return { id: user.id, name, firstName, initials, email: user.email };
});

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;
