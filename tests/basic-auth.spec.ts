import { test, expect } from "@playwright/test";

test("production gates pages, APIs, and assets before application auth", async ({
  playwright,
}) => {
  const anonymous = await playwright.request.newContext({
    baseURL: "http://localhost:3100",
  });
  try {
    for (const path of [
      "/",
      "/login",
      "/dashboard",
      "/api/auth/get-session",
      "/mediawave-logo.png",
      "/_next/static/protected.js",
    ]) {
      const response = await anonymous.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(401);
      expect(response.headers()["www-authenticate"]).toContain("Basic");
      expect(response.headers()["cache-control"]).toBe("no-store");
    }
    const rejected = await anonymous.get("/login", {
      headers: {
        Authorization: `Basic ${Buffer.from("admin:wrong").toString("base64")}`,
      },
    });
    expect(rejected.status()).toBe(401);
    const headers = {
      Authorization: `Basic ${Buffer.from("admin:commerce-cockpit").toString("base64")}`,
    };
    expect((await anonymous.get("/login", { headers })).status()).toBe(200);
    expect(
      (
        await anonymous.get("/dashboard", { headers, maxRedirects: 0 })
      ).status(),
    ).toBe(307);
  } finally {
    await anonymous.dispose();
  }
});
