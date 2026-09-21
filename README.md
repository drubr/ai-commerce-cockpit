# Trodat Punchout

Next.js 16.3.4 App Router application with TypeScript, React 19, Tailwind CSS 4, shadcn/ui (Base UI), and Better Auth email/password authentication.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Setup automatically creates a local SQLite database and a random persistent auth secret in `.data/`, then seeds the single demo account:

- Email: `dominik.rubroeder@mediawave.de`
- Password: `Login12345`

Public sign-up is disabled. Better Auth validates the password and issues database-backed sessions. `/dashboard` and every nested route are protected by session validation in the Next.js proxy, with additional server checks in the layout and pages. Sign-out revokes the session.

## Pages

- `/login`: email/password login with accessible errors and password visibility toggle.
- `/dashboard`: compact workspace overview using clearly labeled sample data.
- `/dashboard/field-mapping`: editable cXML field mappings, search, required-field and duplicate-target validation, reset, and local browser persistence.

Mapping data is a browser-local demo; it does not connect to procurement services.

## Component system and design

`src/components/ui` contains the shared shadcn Base UI primitives. Specialized `EmailInput` and `PasswordInput` compose the root `Input`; `FieldSelect` composes the root `Select`. All buttons use the shared `Button`, and both dashboard pages share the sidebar, shell, and heading.

Theme tokens live in `src/app/globals.css`: background `#f3f3f3`, white inputs, black foreground, muted foreground `#4c4c4c`, and red accent `#d01b22`. The 60/30/10 rule guides the visual hierarchy: dominant neutral backgrounds, supporting foreground and structure, and restrained accent on primary actions and focal points. The content container uses Tailwind `max-w-3xl` (48rem / 768px). The sidebar becomes a drawer on mobile.

Buttons use fully rounded corners; text inputs and select fields use square corners. The minimum font size is `0.875rem` (14px), including captions, badges, and helper text.

Use `bg-page-gradient` to opt into `linear-gradient(#f6f6f6, #fff 30%)`. The shared dashboard shell also accepts `background="gradient"`; its default remains solid.

`getCurrentUser()` in `src/lib/current-user.ts` reads the authenticated Better Auth user and returns safe display data (name, first name, initials, email, and ID). The dashboard greeting and sidebar use this helper; the demo sign-in restriction remains in place.

## Checks

```sh
npm run lint
npm run typecheck
npm run format:check
npm run build
npm test
```

Prettier automatically sorts Tailwind classes, including `cn` and `cva` expressions. Playwright tests run against a production server and cover login rejection/success, route protection, forged cookies, disabled sign-up, mapping persistence/validation, sign-out, and mobile navigation. Install test browsers if needed with `npx playwright install chromium`.

If this host restricts Turbopack worker processes, build with `npm run auth:setup` followed by `npx next build --webpack`.

## Hosting

This demo requires a Node.js host with a persistent writable `.data` directory. Set `BETTER_AUTH_URL` to the actual origin and `BETTER_AUTH_SECRET` to a random secret of at least 32 characters (see `.env.example`). Keep `.data` private. Replace the public demo account and sample data before using this application for real users. SQLite is intended for one persistent application instance; use a shared production database before scaling across instances.

## Two-factor sign-in

The login form uses [Better Auth's two-factor plugin](https://better-auth.com/docs/plugins/2fa).
Setup migrates the plugin tables, enables email OTP for the demo account, and
revokes its existing password-only sessions on first migration. After entering
the correct password, enter the six-digit email code to access the dashboard.
Codes expire after five minutes and are stored hashed. Better Auth handles
verification attempt limits and challenge/session cookies. The form supports
resending codes with a 30-second cooldown and returning to password entry.

Configure `RESEND_API_KEY` and `OTP_FROM_EMAIL` in `.env.local` to use
[Resend](https://resend.com/docs/api-reference/emails/send-email), with a verified
sender address. Missing email configuration fails closed; password-only access
is not granted. Better Auth logs asynchronous provider failures on the server;
check delivery logs if a requested message does not arrive.

For local development, set `OTP_DELIVERY=file` in `.env.local`. This explicitly
replaces email delivery with a private `.data/otp/<user-id>.json` file containing
the most recently generated code. This mode only accepts a localhost auth URL;
never enable it on a deployed host. Keep these files private like the database.
Playwright uses this transport to verify the real OTP flow without sending email.
New accounts provisioned outside the demo setup must enable OTP via
`authClient.twoFactor.enable({ password, method: "otp" })`.
