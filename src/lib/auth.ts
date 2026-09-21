import "server-only";
import { readFileSync } from "node:fs";
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { sendLoginOtp } from "@/lib/send-login-otp";

export const auth = betterAuth({
  appName: "Trodat Punchout",
  plugins: [
    twoFactor({
      otpOptions: {
        digits: 6,
        period: 5,
        storeOTP: "hashed",
        sendOTP: sendLoginOtp,
      },
    }),
  ],
  database: new Database(".data/auth.db"),
  secret:
    process.env.BETTER_AUTH_SECRET || readFileSync(".data/auth-secret", "utf8"),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: { enabled: true, disableSignUp: true },
  session: { expiresIn: 60 * 60 * 8 },
});
