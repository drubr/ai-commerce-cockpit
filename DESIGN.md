# Design system

This document records the design standards implemented in the Commerce Cockpit / Trodat Punchout workspace. It describes the current code, including local exceptions; it is not a proposed redesign. When extending the interface, reuse the tokens and components below.

## Sources of truth

| Area                                   | Source                                           |
| -------------------------------------- | ------------------------------------------------ |
| Colors, typography, radii, base styles | `src/app/globals.css`                            |
| Loaded font weights                    | `src/app/layout.tsx`                             |
| Component configuration                | `components.json`                                |
| Shared UI primitives                   | `src/components/ui/`                             |
| Brand asset and rendering              | `src/components/brand.tsx`                       |
| Workspace layout and navigation        | `src/components/dashboard/workspace-shell.tsx`   |
| Page hierarchy                         | `src/components/dashboard/page-heading.tsx`      |
| Dashboard composition                  | `src/app/dashboard/page.tsx`                     |
| Charts                                 | `src/components/dashboard/dashboard-charts.tsx`  |
| Mapping workflow                       | `src/components/dashboard/mapping-editor.tsx`    |
| Authentication layout and fields       | `src/app/login/page.tsx`, `src/components/auth/` |

The implementation uses Tailwind CSS v4, shadcn's `base-nova` style, Base UI primitives, Lucide icons, and Recharts. CSS variables are enabled; the configured base color is neutral, but the application overrides it with the blue palette below. Prefer local components over introducing a second component library.

## Visual direction and brand

The interface is a compact commerce workspace: pale blue page backgrounds, white content surfaces, navy text, blue actions, and a dark navy navigation rail. Borders provide most of the separation. Dashboard cards explicitly avoid shadows; floating elements use modest shadows.

Use `Brand` and `/mediawave-logo.png` for the current application identity. It preserves the image's aspect ratio with `object-contain` and caps its height at `max-h-11` (44px). The sidebar renders it white with `brightness-0 invert`, with `h-auto w-full`. Preserve the accessible text, “mediawave logo.” Trodat logo files exist in `public/`, but the shared brand component uses mediawave.

Product naming currently combines “Commerce Cockpit” in page metadata, “Trodat Punchout” in the workspace footer, and mediawave branding. Follow the relevant existing surface rather than inventing a new identity.

## Color tokens

Use semantic utilities such as `bg-background`, `text-foreground`, `border-border`, and `text-muted-foreground`. Values below are defined in `:root`.

| Token                                   | Value     | Role                              |
| --------------------------------------- | --------- | --------------------------------- |
| `background`                            | `#f5f9fd` | Page canvas                       |
| `foreground`                            | `#09234b` | Main text                         |
| `card`, `popover`                       | `#ffffff` | Content and floating surfaces     |
| `card-foreground`, `popover-foreground` | `#09234b` | Surface text                      |
| `primary`                               | `#1675d1` | Primary actions, links, emphasis  |
| `primary-foreground`                    | `#ffffff` | Text on primary                   |
| `secondary`                             | `#eaf3fc` | Secondary actions and badges      |
| `secondary-foreground`                  | `#09234b` | Secondary text                    |
| `muted`                                 | `#edf4fa` | Subtle fills and table treatments |
| `muted-foreground`                      | `#607b9d` | Supporting text and metadata      |
| `accent`                                | `#e2f2ff` | Highlighted areas and icon tiles  |
| `accent-foreground`                     | `#1675d1` | Accent text                       |
| `destructive`                           | `#b42318` | Errors and destructive actions    |
| `border`                                | `#dfebf5` | General dividers and outlines     |
| `input`                                 | `#cfdeed` | Form control borders              |
| `ring`                                  | `#1675d1` | Focus indication                  |

### Sidebar

| Token                        | Value     |
| ---------------------------- | --------- |
| `sidebar`                    | `#172e46` |
| `sidebar-foreground`         | `#d8e6f6` |
| `sidebar-primary`            | `#1675d1` |
| `sidebar-primary-foreground` | `#ffffff` |
| `sidebar-accent`             | `#1c4f83` |
| `sidebar-accent-foreground`  | `#ffffff` |
| `sidebar-border`             | `#304b66` |
| `sidebar-ring`               | `#1675d1` |

### Chart palette

| Token     | Value     | Current assignment                                  |
| --------- | --------- | --------------------------------------------------- |
| `chart-1` | `#3478f6` | SAP Ariba                                           |
| `chart-2` | `#18bac1` | Coupa                                               |
| `chart-3` | `#87caff` | Revenue                                             |
| `chart-4` | `#183f91` | Available, currently unassigned in dashboard charts |
| `chart-5` | `#9484f5` | SAP SRM                                             |

### Existing exceptions

- Positive KPI changes use `text-emerald-700`; there is no semantic success token. Connected and saved states use secondary badges rather than a universal green treatment.
- `bg-page-gradient` is a 135-degree gradient from `#f5faff` to white at 65%. The workspace shell exposes it as an optional background.
- The dashboard greeting uses a separate horizontal gradient: `from-blue-100/80 via-sky-50 to-background`.
- Text selection uses `#bfe5ff`.
- Some current surfaces explicitly use `bg-white`. Prefer semantic surface tokens for new reusable components.

A `dark` variant and some component-level dark styles exist, but there is no separate dark token palette in `globals.css`. Treat the current application as a light theme with a dark sidebar, not a complete dark-mode system.

## Typography

Use Source Sans Pro for both body text and headings, falling back to Arial, Helvetica, and sans-serif. The app loads Latin weights 400, 600, and 700. Existing `font-medium` utilities request weight 500, which is not loaded separately. Technical field identifiers use `ui-monospace, monospace` through `font-mono`.

Sizes below assume the default 16px root size.

| Usage                                          | Existing treatment                                       |
| ---------------------------------------------- | -------------------------------------------------------- |
| Page title and KPI values                      | `text-3xl` (30px), `font-semibold`, `tracking-tight`     |
| Form subsection / mapping summary value        | `text-lg` (18px), `font-semibold`                        |
| Default card title                             | `text-base` (16px), `font-medium`, `leading-snug`        |
| Body, navigation, labels, descriptions, tables | Usually `text-sm` (14px / 20px)                          |
| Page eyebrow                                   | `text-sm`, `font-medium`, uppercase, `tracking-[0.16em]` |
| Technical source field                         | `font-mono text-sm text-muted-foreground`                |
| Metric numbers                                 | `tabular-nums`                                           |

`text-xs` is explicitly overridden to **14px / 20px**, so it is not smaller than `text-sm`. Inputs default to `text-base` and switch to `text-sm` at `md`, unless a caller overrides this.

All native headings, card titles, and sheet titles have `letter-spacing: -0.025em`. Supporting page descriptions use muted text with `leading-6`. Use uppercase for eyebrows, table-like mapping headers, and the demo environment marker, not general body copy.

## Spacing, shape, and elevation

Use Tailwind's spacing scale. Common values are 4px (`1`), 8px (`2`), 12px (`3`), 16px (`4`), 20px (`5`), 24px (`6`), 28px (`7`), 32px (`8`), and 36px (`9`). Half steps such as `2.5` and `3.5` provide 10px and 14px spacing.

The base radius is `--radius: 0.625rem` (10px):

| Radius utility | Computed size |
| -------------- | ------------- |
| `rounded-sm`   | 6px           |
| `rounded-md`   | 8px           |
| `rounded-lg`   | 10px          |
| `rounded-xl`   | 14px          |
| `rounded-2xl`  | 18px          |
| `rounded-3xl`  | 22px          |
| `rounded-4xl`  | 26px          |

Cards and framed data sections generally use `rounded-xl`; notices use `rounded-lg`; workspace navigation uses `rounded-md`. Buttons are pills (`rounded-full`), badges use `rounded-4xl`, and inputs and select triggers deliberately use `rounded-none`. Preserve these distinctions.

Cards use a 1px foreground ring at 10% opacity. Tables and sections use thin borders. Select popups use `shadow-md`; sheets use `shadow-lg`. Avoid adding heavy shadows to ordinary content panels.

## Layout and responsive behavior

### Workspace

- Reuse `WorkspaceShell` for sidebar, header, main content, and footer.
- Desktop sidebar width is **15rem (240px)**, overriding the primitive's 16rem default. Mobile sidebar width is **18rem (288px)**.
- The current sidebar uses the default off-canvas collapse behavior. The primitive also supports a 3rem icon rail; that is not the current workspace configuration.
- The header has a 64px minimum height, a bottom border, wrapping content, and 12px vertical padding.
- Main content is centered at `max-w-7xl` (1280px), with 20px horizontal padding, increasing to 32px at `sm`, and 36px vertical padding.
- The footer shares the main content width and horizontal padding.
- Workspace navigation rows are 44px tall, with 12px horizontal padding, 16px icon/text gaps, and 20px icons. Active and hover states use sidebar accent colors.

Use `PageHeading` for the eyebrow, title, description, and optional action. Its default bottom margin is 28px; actions wrap beside the title. The dashboard places it inside a padded greeting panel and removes that default bottom margin locally.

### Breakpoints and composition

The project uses the default Tailwind breakpoints relevant to these screens: `sm` 640px, `md` 768px, `lg` 1024px, and `xl` 1280px. The mobile hook uses `(max-width: 47.999rem)` to align with `md`.

- KPI cards: one column by default, two at `sm`, four at `xl`; 16px gaps.
- Charts: one column by default, two at `lg`; 16px gaps.
- Tables: horizontal scrolling within their own container, with nowrap cells.
- Mapping search: full width on small screens, `w-52` (208px) at `sm`.
- Mapping rows: retain a `1fr / 1.2fr` two-column grid; the arrow is hidden below `sm`.
- Mapping summary: retains three columns at all breakpoints.
- Login: centered `max-w-sm` (384px) form region within a `max-w-6xl` wrapper; 24px horizontal page padding, increasing to 48px at `lg`.

Preserve wrapping action groups and `min-w-0` on flexible content. Do not assume every data layout stacks on mobile; verify long labels and narrow screens when extending these patterns.

## Component standards

### Buttons

Reuse `Button` and its variants:

| Variant       | Intended use / current appearance                             |
| ------------- | ------------------------------------------------------------- |
| `default`     | Primary action; blue fill, white text, 80% primary hover fill |
| `outline`     | Bordered action on the background surface                     |
| `secondary`   | Pale blue supporting action                                   |
| `ghost`       | Low-emphasis actions such as reset and sign out               |
| `destructive` | Tinted red background and red text                            |
| `link`        | Blue text, underline on hover                                 |

Default height is 32px; `xs`, `sm`, and `lg` are 24px, 28px, and 36px. Icon sizes follow the same 24/28/32/36px control scale. Login overrides the primary action to 44px and full width. Icons default to 16px unless explicitly sized.

Use the component's `render` composition for links; existing navigation CTAs pair `render={<Link ... />}` with `nativeButton={false}`. Preserve real button and link semantics.

### Forms and selects

Use `Input`, `Label`, and `Select` primitives. Inputs have square corners, a white background, input-colored borders, and muted placeholders. Default input/select height is 32px; small select triggers are 28px. Authentication fields are 44px tall.

Keep visible labels associated through `htmlFor` and `id`. Search and mapping select controls use descriptive `aria-label` values. Reuse `EmailInput` and `PasswordInput` for authentication behavior, including autocomplete and the labeled visibility toggle. OTP inputs use numeric entry, six digits, and linked helper text.

`FieldSelect` is the established mapping control: full-width white trigger, “Not mapped” option, and target-specific accessible label. Dropdowns use rounded popup surfaces, check indicators, and scrolling when needed.

### Cards, badges, and tables

Cards compose `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and optional `CardFooter`. Default card spacing is 16px; `size="sm"` uses 12px. KPI cards override wrapper spacing and use 16px content padding.

Badges are compact 24px-high labels with 14px text and 12px icons. They support default, secondary, destructive, outline, ghost, and link variants. Pair state text with an icon where the existing pattern does so; color alone should not carry the meaning.

Tables use 14px text, 40px header cells, 8px default cell padding, bottom row borders, and a muted hover fill. The dashboard adds a white rounded border wrapper, muted header background, 12px vertical body padding, and 16px outer-column padding. Right-align the last-activity column as in the existing connections table.

### Charts

Use `ChartContainer` with a `ChartConfig`, shared tooltip/legend components, and semantic chart colors. Current plots are 250px high, with horizontal grid lines and no axis or tick lines. Session areas are monotone, stacked, with 2px strokes and 20% fill opacity. Revenue bars have 5px top corners and a 42px maximum width.

Preserve the `accessibilityLayer` and descriptive chart `aria-label` summaries. Include series labels, units, time ranges, and clear sample-data labeling.

## Interaction, feedback, and accessibility

- Keep visible keyboard focus. Buttons, inputs, and selects use a ring-colored border and a 3px ring at 50% opacity; sidebar controls use their own ring treatment.
- Disabled controls use reduced opacity and prevent interaction. Pending login changes its label to “Please wait…” and shows a spinning loader.
- Invalid-state styling is available through `aria-invalid`, with destructive borders and rings. It must be wired to actual validation where used; component support alone does not make a form invalid.
- Authentication errors use `role="alert"` and destructive text; notices use `role="status"` and muted text.
- Mapping feedback currently uses a polite live status region and muted text for both success and validation messages. Dirty state disables/enables Save changes and displays “Unsaved changes” or “All changes saved.”
- Preserve the workspace skip link and `main-content` target, labeled navigation regions, and `aria-current="page"` on active links. Mobile navigation closes after selecting a link.
- Icon-only actions need accessible names, following “Sign out,” “Show password,” and “Hide password.”
- Preserve explicit loading and empty states, such as “Loading field mappings…” and the query-specific no-results message.

Motion is brief and functional: select popups use 100ms transitions, sheet backdrops 150ms, and sheet/sidebar movement 200ms. Buttons have a 1px pressed translation except popup triggers. The current code does not establish a global reduced-motion policy; do not describe one as already implemented.

These are implementation patterns, not a claim of completed accessibility or contrast certification.

## Content conventions

Use short, direct action labels (“Save changes,” “Manage mappings,” “Reset to defaults”), descriptive helper text, and recoverable error messages. Existing greetings are friendly and brief. Keep demo and local-save limitations visible where relevant.

Most visible product copy is English. The document language is `en`, while the workspace navigation currently has German accessible labels. There is no unified localization convention established by these components.

## Extending the system

1. Start with the existing UI primitives and page compositions; add a shared variant when behavior or styling is genuinely reused.
2. Prefer semantic colors and existing spacing/radius utilities. Keep screen-specific exceptions local and document any new shared token in `globals.css` and here.
3. Preserve keyboard behavior, focus, labels, disabled/pending feedback, and meaningful state text when composing primitives.
4. Check the changed surface at narrow and wide widths, with long text, empty data, and applicable loading/error states.
5. Update this document when shared tokens, component defaults, or layout conventions change. Distinguish supported primitive options from behavior actually used by the application.
