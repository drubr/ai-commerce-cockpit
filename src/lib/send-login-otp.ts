import "server-only";
import { mkdirSync, writeFileSync } from "node:fs";
import { APIError } from "better-auth/api";

export function sendLoginOtp({
  user,
  otp,
}: {
  user: { id: string; email: string };
  otp: string;
}) {
  if (process.env.OTP_DELIVERY === "file") {
    const hostname = new URL(
      process.env.BETTER_AUTH_URL || "http://localhost:3000",
    ).hostname;
    if (!["localhost", "127.0.0.1", "[::1]"].includes(hostname)) {
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "File OTP delivery is only available locally.",
      });
    }
    mkdirSync(".data/otp", { recursive: true, mode: 0o700 });
    writeFileSync(
      `.data/otp/${user.id}.json`,
      JSON.stringify({ email: user.email, otp }),
      { mode: 0o600 },
    );
    return Promise.resolve();
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.OTP_FROM_EMAIL;
  // Throw synchronously: Better Auth logs asynchronous delivery failures.
  if (!apiKey || !from) {
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "OTP email delivery is not configured.",
    });
  }
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [user.email],
      subject: "Your Trodat sign-in code",
      text: `Your Trodat sign-in code is ${otp}. It expires in 5 minutes. If you did not request this code, ignore this email.`,
    }),
    signal: AbortSignal.timeout(10000),
  }).then((response) => {
    if (!response.ok) throw new Error("OTP email provider rejected delivery.");
  });
}
