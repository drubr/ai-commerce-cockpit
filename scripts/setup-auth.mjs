import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { getMigrations } from "better-auth/db/migration";

mkdirSync(".data", { recursive: true });
if (!existsSync(".data/auth-secret"))
  writeFileSync(".data/auth-secret", randomBytes(48).toString("hex"), {
    mode: 0o600,
  });
const database = new Database(".data/auth.db");
const auth = betterAuth({
  database,
  plugins: [twoFactor()],
  advanced: { database: { validateSchema: false } },
  secret: randomBytes(48).toString("hex"),
  baseURL: "http://localhost:3000",
  emailAndPassword: { enabled: true },
});
await (await getMigrations(auth.options)).runMigrations();
if (
  !database
    .prepare("SELECT id FROM user WHERE email = ?")
    .get("dominik.rubroeder@mediawave.de")
) {
  await auth.api.signUpEmail({
    body: {
      name: "Dominik Rubroeder",
      email: "dominik.rubroeder@mediawave.de",
      password: "Login12345",
    },
  });
  console.log("Demo account created.");
}
// Revoke password-only sessions when enabling OTP for the demo account.
database.transaction(() => {
  database
    .prepare(
      "DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE email = ? AND COALESCE(twoFactorEnabled, 0) = 0)",
    )
    .run("dominik.rubroeder@mediawave.de");
  database
    .prepare("UPDATE user SET twoFactorEnabled = 1 WHERE email = ?")
    .run("dominik.rubroeder@mediawave.de");
})();
database.close();
