import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import Database from "better-sqlite3";
const email = "dominik.rubroeder@mediawave.de";
const password = "Login12345";
// Preserve real auth throttling while separating tests that share one local IP.
test.beforeEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 11000));
});
function latestOtp() {
  const db = new Database(".data/auth.db", { readonly: true });
  const user = db.prepare("SELECT id FROM user WHERE email = ?").get(email) as {
    id: string;
  };
  db.close();
  return JSON.parse(readFileSync(`.data/otp/${user.id}.json`, "utf8"))
    .otp as string;
}
async function verifyOtp(page: import("@playwright/test").Page) {
  await expect(page.getByLabel("Verification code")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Check your email");
  await page.getByLabel("Verification code").fill(latestOtp());
  await page.getByRole("button", { name: "Verify and sign in" }).click();
}

test("all dashboard routes reject missing and forged sessions", async ({
  request,
}) => {
  for (const route of [
    "/dashboard",
    "/dashboard/field-mapping",
    "/dashboard/unknown",
  ]) {
    for (const cookie of ["", "better-auth.session_token=forged"]) {
      const response = await request.get(route, {
        maxRedirects: 0,
        headers: { cookie },
      });
      expect(response.status()).toBe(307);
      expect(response.headers().location).toContain("/login");
    }
  }
  const signup = await request.post("/api/auth/sign-up/email", {
    data: { name: "Other", email: "other@example.com", password },
    headers: { origin: "http://localhost:3100" },
  });
  expect(signup.ok()).toBe(false);
});

test("login, mapping persistence, validation, and logout", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("WrongPassword");
  await page.getByRole("button", { name: "Sign in to workspace" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "incorrect" }),
  ).toContainText("incorrect");
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in to workspace" }).click();
  await verifyOtp(page);
  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Good to see you, Dominik." }),
  ).toBeVisible();
  expect(
    await page
      .locator("#main-content")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(1280);
  await expect(
    page.getByText("Session activity", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("[data-chart] .recharts-surface")).toHaveCount(2);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(1280);
  await page.screenshot({ path: "test-results/dashboard.png", fullPage: true });
  await page.getByRole("link", { name: "Integrationen", exact: true }).click();
  await expect(page).toHaveURL("/dashboard/field-mapping");
  await page
    .getByRole("combobox", { name: "Target for Product image" })
    .click();
  await page.getByRole("option", { name: "Not mapped", exact: true }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Mappings saved");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Target for Product image" }),
  ).toContainText("Not mapped");
  await page.getByRole("combobox", { name: "Target for Product SKU" }).click();
  await page.getByRole("option", { name: "Not mapped", exact: true }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("required fields");
  await page.getByRole("button", { name: "Reset to defaults" }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await page
    .getByRole("textbox", { name: "Search fields" })
    .fill("no-such-field");
  await expect(page.getByText("No fields match")).toBeVisible();
  await page.getByRole("textbox", { name: "Search fields" }).fill("");
  await page.screenshot({
    path: "test-results/field-mapping.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("/login");
  await page.goto("/dashboard/field-mapping");
  await expect(page).toHaveURL("/login");
  await page.screenshot({ path: "test-results/login.png", fullPage: true });
});

test("mobile navigation and layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in to workspace" }).click();
  await verifyOtp(page);
  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("[data-chart] .recharts-surface")).toHaveCount(2);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/dashboard-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Toggle Sidebar" }).click();
  await page.getByRole("link", { name: "Integrationen", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Field Mapping", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});

test("OTP rejects wrong codes and password-only sessions; consumed codes cannot be replayed", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in to workspace" }).click();
  await expect(page.getByRole("status")).toContainText("Check your email");
  const code = latestOtp();
  const protectedPage = await page.request.get("/dashboard", {
    maxRedirects: 0,
  });
  expect(protectedPage.status()).toBe(307);
  await page
    .getByLabel("Verification code")
    .fill(code === "000000" ? "111111" : "000000");
  await page.getByRole("button", { name: "Verify and sign in" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "invalid or expired" }),
  ).toBeVisible();
  await page.getByLabel("Verification code").fill(code);
  await page.getByRole("button", { name: "Verify and sign in" }).click();
  await expect(page).toHaveURL("/dashboard");
  await page.getByRole("button", { name: "Sign out" }).click();
  await new Promise((resolve) => setTimeout(resolve, 11000));
  const replay = await page.request.post("/api/auth/two-factor/verify-otp", {
    data: { code },
    headers: { origin: "http://localhost:3100" },
  });
  expect(replay.status()).toBe(401);
});
