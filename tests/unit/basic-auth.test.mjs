import assert from "node:assert/strict";
import { test } from "node:test";
import { hasValidBasicAuth } from "../../src/lib/basic-auth.ts";

const header = (value) => `Basic ${Buffer.from(value).toString("base64")}`;

test("accepts the supplied credentials and case-insensitive scheme", () => {
  assert.equal(hasValidBasicAuth(header("admin:commerce-cockpit")), true);
  assert.equal(
    hasValidBasicAuth(
      header("admin:commerce-cockpit").replace("Basic", "basic"),
    ),
    true,
  );
});

test("rejects missing, malformed, wrong, and incomplete credentials", () => {
  for (const value of [
    null,
    "",
    "Basic",
    "Basic !!!",
    "Bearer token",
    header("admin:wrong"),
    header("other:commerce-cockpit"),
    header("admin"),
    header("admin:commerce-cockpit:extra"),
  ]) {
    assert.equal(hasValidBasicAuth(value), false);
  }
});
