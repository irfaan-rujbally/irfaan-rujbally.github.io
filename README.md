# Irfaan Rujbally — Portfolio

Single-page portfolio site. React 19 + TypeScript + Vite 8 + Tailwind v4, with an
interactive WebGL skills globe (three.js / React Three Fiber). Fully static —
deploys free to GitHub Pages.

---

## ⚠️ Before going live

The site is complete and deployable, but these need your input. They're ordered
by impact.

| # | What | Where |
|---|---|---|
| 1 | **3–6 real projects.** Title, one-line outcome, description, tech, screenshot, links. Until you add them the Projects section shows an honest "coming soon" empty state — placeholder cards are dev-only and never ship. | `src/data/projects.ts` |
| 2 | **Achievement bullets per role** — what you built and what it changed. The current bullets describe the scope of each job factually; nothing is invented, but nothing is impressive either. | `src/data/experience.ts` |
| 3 | **Your CV as a PDF** at `public/Irfaan-Rujbally-CV.pdf` — the "Download CV" button links straight to it. | `public/` |
| 4 | **GitHub profile URL.** Set `githubUrl` and the GitHub links appear automatically (they stay hidden while it's empty). | `src/data/profile.ts` |
| 6 | **Years of experience per technology** — `yearsOfUse` is 0 everywhere, which the UI reads as "not confirmed" and hides the bar for. | `src/data/skills.ts` |
| 7 | **Check your skills list is complete.** The Languages line on the CV was cut off after "Java" in the copy provided. | `src/data/skills.ts` |
| 8 | **Resolve one CV inconsistency.** The CV summary says "freelance developer in Europe", but the experience table puts the 2022 freelance year in Mauritius/Remote and the only French role is the 2021 Lyon 1 assistantship. The About copy currently avoids the claim. | `src/data/profile.ts` |
| 9 | **Set the real URL** in `seo.url`, `index.html` (canonical + og:url), `public/robots.txt` and `public/sitemap.xml` once you know the deployed address. | several |

**Done:** the portrait is in at `public/img/irfaan-portrait.webp`, pre-cropped to
the 4:5 the About slot expects.

---

## Getting started

```bash
npm install
cp .env.example .env      # then fill in VITE_FORMSPREE_ID
npm run dev               # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check, production build, write `dist/404.html` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |
| `npm run lint` | oxlint |
| `npm run logos` | Re-rasterise `public/logos/tech/*.svg` → 256px PNG textures |

---

## Where the content lives

**Every string a visitor reads is in `src/data/`.** You never need to open a
component to update the site.

```
src/data/profile.ts      name, contact, hero copy, About copy, stats, interests
src/data/experience.ts   the eight roles
src/data/education.ts    the three degrees
src/data/skills.ts       the 26 technologies on the globe
src/data/projects.ts     case studies  ← the important one
```

### Adding a project

Edit `src/data/projects.ts`. Put a 16:10 screenshot (ideally 1600×1000, `.webp`)
in `public/img/projects/` and reference it as `img/projects/name.webp`.

```ts
{
  id: 'order-portal',
  title: 'Order Processing Portal',
  outcome: 'Cut order turnaround from two days to four hours.',  // the RESULT, not the stack
  description: 'One or two sentences on the problem and how you solved it.',
  tech: ['Laravel', 'Vue.js', 'MySQL'],
  image: 'img/projects/order-portal.webp',
  liveUrl: 'https://…',        // omit if there's nothing public
  codeUrl: 'https://github…',  // omit if the repo is private
  featured: true,              // exactly ONE project — it gets the wide hero card
  isPlaceholder: false,        // ← must be false for it to appear in production
}
```

`outcome` is the highest-leverage line on the page. "Cut order processing time by
40%" beats "Built with Laravel" every time — the stack is already in `tech`.

### Adding a technology to the globe

1. Drop the SVG in `public/logos/tech/<id>.svg` (Devicon is a good source, MIT).
2. Run `npm run logos` to rasterise it into a globe texture.
3. Add an entry to `src/data/skills.ts` using the same `<id>`.

Four technologies have no Devicon entry and use hand-drawn accent glyphs instead:
Ajax, SQL, MS Office and Virtual Machines.

---

## The skills globe

`src/components/globe/`. 26 logo tiles distributed over a sphere by the
golden-angle (Fibonacci) method, billboarded so they always face the camera.

A few things worth knowing before you change it:

- **Compositing is multiplicative.** Depth, hover, the `featured` flag, category
  filtering and selection dimming all want a say in each tile's scale and opacity.
  `GlobeScene` computes each factor separately and assigns only the product.
  Assigning any single factor directly would clobber the others every frame —
  hover would visibly stop working.
- **The render loop pauses off-screen** via an `IntersectionObserver` driving the
  `<Canvas frameloop>` prop. This is the main reason scrolling stays smooth.
- **three.js is never in the initial bundle** — `GlobeCanvas` is lazy-loaded, so
  the 888 kB 3D chunk only downloads when the Skills section is near the viewport.
- **Three fallbacks, all of which have to look good:** no WebGL → CSS grid via an
  error boundary; mobile → CSS grid by default with a "View as 3D globe" opt-in;
  `prefers-reduced-motion` → sphere renders static but stays draggable.
- **Dark mode adds a light chip behind every tile.** Several brand marks are
  near-black and would vanish on a dark canvas.

---

## Contact form

No backend is required. The form posts to [FormSubmit](https://formsubmit.co)
and forwards submissions to the email address in `src/data/profile.ts`.

The first submission triggers an activation email to the recipient. Follow the
confirmation link in that email to enable delivery of subsequent messages.

---

## Deployment (GitHub Pages, free)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

**One-time setup:** repo Settings → Pages → Source → **GitHub Actions**.

### The base path — get this right or you get a blank page

This is the single most common cause of a white screen on GitHub Pages.

| Repo name | Site URL | `BASE_PATH` |
|---|---|---|
| `<username>.github.io` | `https://<username>.github.io/` | `/` |
| anything else, e.g. `irfaan-porfolio` | `https://<username>.github.io/irfaan-porfolio/` | `/irfaan-porfolio/` |

Set it in `.github/workflows/deploy.yml` under the build step's `env:`. Locally:

```bash
BASE_PATH=/irfaan-porfolio/ npm run build && npm run preview
```

Every asset reference in the code already goes through `asset()` or `%BASE_URL%`,
so changing this one value is all that's needed.

### Custom domain

Worth doing — it changes how a client reads the site. Buy a domain, add
`public/CNAME` containing just the domain (e.g. `irfaan.dev`), point a `CNAME`
DNS record at `<username>.github.io`, and set `BASE_PATH` back to `/`.

---

## Notes

- **Company and school logos are opt-in per organisation.** They're copyrighted
  trademarks, so only the ones actually placed in `public/logos/org/` are used.
  Education cards render `<OrgLogo>`, which falls back to the `<OrgMark>`
  monogram (initials on a tinted rounded square) whenever the file is missing —
  so adding a logo is a drop-in with no code change. Point `logo` in
  `src/data/education.ts` at the file. Experience still uses `<OrgMark>`
  directly. Keep logos ≤40px, always beside the organisation's name, never in
  the hero or nav, and keep the trademark line in the footer.
- **Fonts are self-hosted** via `@fontsource-variable` (Geist, Geist Mono, Inter)
  — no Google Fonts round trip, no privacy footnote.
- **One console warning in dev:** `THREE.Clock: This module has been deprecated`.
  It comes from inside React Three Fiber, not this code, and will clear when R3F
  updates. Nothing else logs.

---

## Accessibility

Treated as a hard requirement, not a nice-to-have:

- Semantic landmarks, one `h1`, no skipped heading levels.
- Full keyboard operability with a visible 2px focus ring on everything.
- Skip-to-content link.
- The globe canvas carries an `aria-label`, **and** the same skill data is mirrored
  into the DOM as a visually-hidden list so screen readers get the content.
- Real `<label>` elements; errors linked with `aria-describedby` and `role="alert"`.
- The custom cursor is desktop/fine-pointer only and never hides the native cursor
  from keyboard or touch users.
- `prefers-reduced-motion: reduce` disables Lenis, parallax, the idle globe spin,
  the name reveal and the role rotator — the site stays fully usable and still
  looks composed.
