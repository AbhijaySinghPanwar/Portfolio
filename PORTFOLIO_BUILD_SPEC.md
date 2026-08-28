# Portfolio Website — Build Spec

**For:** Abhijay Singh Panwar
**Purpose:** hand this file to Claude Code as the single source of truth for building the site.
**Suggested first prompt:** `Read PORTFOLIO_BUILD_SPEC.md and execute Phase 0 and Phase 1. Stop and show me the hero before continuing.`

---

## 0. The brief in one paragraph

A single-page, dark, WebGL-heavy portfolio for a final-year IT student who builds retrieval systems, data pipelines and deployed AI products. The site should feel like a piece of engineering, not a template: one big 3D centerpiece that is genuinely tied to the subject matter (embeddings, retrieval, pipelines), enormous editorial typography, and scroll as the primary instrument. Everything else stays quiet.

**Reference feel (do not clone markup, copy, assets, logos or brand names from either):**
- `gdrinkme.com` — black canvas, oversized display type that the media element sits *inside* and occludes, pill-shaped nav, spherical fisheye media, single red accent dot.
- `trionn.com` — dark stage, one hero 3D object with thin rim-light, tracked-out monospace micro-labels, cursor-reactive lines, sound toggle, understated "hold to interact" affordances.

Take the *language* (black stage, one 3D hero, type-over-media occlusion, mono micro-labels, restrained accents). Invent the rest.

---

## 1. Design tokens

Define these in `app/globals.css` as CSS custom properties and mirror them in `tailwind.config.ts`. Every colour and size in the build must come from here.

### Colour

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#07080A` | Page base. Near-black, slightly cool. |
| `--graphite` | `#14161A` | Cards, section wells, nav pill fill. |
| `--hairline` | `#262A31` | 1px rules, borders, grid lines. |
| `--bone` | `#EFECE6` | Primary text. Warm off-white, never pure `#fff`. |
| `--muted` | `#8A8F98` | Secondary text, mono labels. |
| `--iodine` | `#7B5CFF` | Accent A — "query" / cool. |
| `--ember` | `#FF5A1F` | Accent B — "match" / warm. |

The two accents are **semantic, not decorative**. Cool `--iodine` marks anything representing a *query, input or unresolved state*. Warm `--ember` marks a *result, match or shipped thing*. Live links, deployed-project badges and the hero's retrieval pulse are ember. Section indices, hover states on unvisited items and the particle field's resting state are iodine. Never gradient them together except in the hero shader's rim light.

Accent surface area target: **under 4% of any viewport**. If a screenshot looks colourful, it's wrong.

### Type

Load via `next/font`. Three roles, no more.

- **Display — Instrument Serif** (Google). Only for hero words and section titles. Sizes are absurd on purpose: hero clamps `clamp(4.5rem, 17vw, 15rem)`, line-height `0.82`, letter-spacing `-0.03em`.
- **Body — General Sans** (Fontshare, variable). 400/500. Body copy caps at `65ch`, `1.6` line-height, `1.0625rem`.
- **Utility — JetBrains Mono** (Google). 400/500, always `uppercase`, `letter-spacing: 0.16em`, `0.6875rem`. Section indices, nav, metadata, stack chips, timestamps.

Scale: `0.6875 / 0.8125 / 1.0625 / 1.5 / 2.5 / 4.5 / clamp-hero`. Nothing between steps.

### Grid & spacing

12-column, `max-width: 1440px`, gutter `clamp(1.25rem, 4vw, 5rem)`. Spacing scale in `4px` multiples only: `4 8 12 16 24 32 48 64 96 144 224`. Sections separated by `144px` desktop / `80px` mobile. Border-radius: `999px` for pills, `2px` for everything else — nothing in between.

---

## 2. The signature element

**A latent-space field.** A GPU particle system of ~40,000 points in a sphere, rendered as the hero object and *persisting across the whole page* as a fixed background layer.

Why it earns its place: the work in this portfolio is embeddings, retrieval and pipelines. The field literally shows a vector space. It is not an abstract blob chosen because 3D looks nice.

Behaviour, scroll-driven:

1. **Hero** — points drift in a slow-rotating sphere, idle noise, iodine-tinted, dense at the core. Cursor exerts a soft repulsion within ~180px, easing back over ~0.8s.
2. **Query pulse** — every ~6s (and on any cursor click), a ripple travels from centre outward; points it passes flash ember for ~400ms then decay back to iodine. This is a retrieval query hitting an index.
3. **Experience section** — the sphere unspools into a horizontal *stream*: points form ~5 lanes flowing left-to-right, like records moving through a pipeline. Ties to the Tech Mahindra ingestion work.
4. **Projects section** — the field collapses to the far right and dims to ~15% opacity so cards read cleanly. On hovering a project card, ~2,000 points detach and cluster into a loose shape near that card in that project's accent.
5. **Contact** — points converge into a single tight, slowly-breathing core.

Implementation: one `<Canvas>` mounted once in the root layout at `position: fixed; inset: 0; z-index: 0`, all DOM content at `z-index: 10`. Do **not** mount a canvas per section.

Transitions between states are driven by a single normalized scroll progress uniform (`uProgress`, 0→1) passed to the shader, plus per-state target-position buffers that the vertex shader lerps between. No re-instantiating geometry on scroll.

---

## 3. Tech stack

```
Next.js 15 (App Router, TypeScript, static export)
Tailwind CSS v4
@react-three/fiber + @react-three/drei + three
@react-three/postprocessing   (Bloom only, low intensity)
GSAP + ScrollTrigger
Lenis                          (smooth scroll, synced to ScrollTrigger)
next/font                      (Instrument Serif, JetBrains Mono; General Sans self-hosted)
```

Custom GLSL in `src/shaders/` as `.glsl` files loaded with `vite-plugin-glsl` equivalent (`raw-loader` or inline template strings — inline is fine, keep them in separate `.ts` files exporting strings).

No UI component library. No animation library beyond GSAP. No state manager — one Zustand store only if scroll state genuinely needs sharing across three or more distant components.

### File structure

```
src/
  app/
    layout.tsx            root, mounts <Scene /> + <Nav /> + <SoundToggle />
    page.tsx              section composition only
    globals.css           tokens, resets, type
  components/
    scene/
      Scene.tsx           <Canvas>, camera, postprocessing
      LatentField.tsx     the 40k-point system
      useScrollState.ts   maps Lenis progress -> uProgress + state index
    sections/
      Hero.tsx
      About.tsx
      Experience.tsx
      Projects.tsx
      ProjectCard.tsx
      Skills.tsx
      Contact.tsx
    ui/
      Nav.tsx
      SectionIndex.tsx    the "01 / INDEX" mono eyebrow
      MagneticLink.tsx
      SoundToggle.tsx
      Cursor.tsx
  shaders/
    field.vert.ts
    field.frag.ts
  data/
    projects.ts
    experience.ts
    skills.ts
  lib/
    useReducedMotion.ts
    useMediaQuery.ts
public/
  Abhijay_Singh_Panwar_Resume.pdf
  og.png
```

Content lives in `src/data/*.ts` as typed arrays. Sections map over them. Never hardcode project copy into JSX.

---

## 4. Sections

Every section gets a mono eyebrow in the left gutter: index, then a label that describes the content honestly (`01 / INDEX`, `02 / BACKGROUND`, …). Numbering is used because the page *is* a sequence — scroll order carries meaning here.

### 01 — Hero

Full viewport. The latent field sphere sits centred. Over it, the display type, with the sphere passing *behind* the first line and *in front of* the second (split into two stacked DOM layers with the canvas z-indexed between them — this is the type-occlusion move from reference 1, and it's the single hardest bit of the layout, so do it properly).

```
┌─────────────────────────────────────────────────┐
│ [a•]                    ○ work  ○ about  contact│
│                                                 │
│                                                 │
│        I  B U I L D                             │
│              ╭───────────╮                      │
│        S Y S(T E M S ····)T H A T                │
│              ╰───────────╯                      │
│              R E M E M B E R                    │
│                                                 │
│ ─────────────────────────────                   │
│ B.TECH IT · VIT VELLORE · 2027    ↓ SCROLL      │
│ INDORE, IN                        CGPA 8.77     │
└─────────────────────────────────────────────────┘
```

Copy: **"I build systems that remember."** It is true (Smritikosh is literally a memory retrieval system; ResumeAI is semantic matching; the arena stores match history) and it is not a portfolio cliché. Do not replace it with "Crafting digital experiences."

Below the fold marker: mono metadata row — role, institution, location, availability. Nothing else. No "scroll to explore" in a serif.

Load sequence, ~1.8s total, orchestrated in one GSAP timeline:
1. Field points fade in from the centre outward (0 → 0.9s, stagger by distance from origin).
2. Display lines mask-reveal upward, line 1 then line 2, 90ms apart.
3. Nav pills fade + drop 8px.
4. Mono metadata fades last.
No spinner, no percentage preloader.

### 02 — About

Two columns: left is a 3-sentence bio in body face, right is a mono spec-sheet list (education, CGPA 8.77, Class XII 93.6%, location, current focus). Bio should say what he actually does — deployed retrieval and pipeline systems — not "passionate developer."

Suggested bio copy (edit freely):
> Final-year IT student at VIT Vellore. I work on retrieval systems and data pipelines — the unglamorous middle layer where embeddings, schemas and inference latency decide whether a product actually works. Most of what's below is deployed and takes real traffic.

### 03 — Experience

One entry. Give it room rather than padding the section with filler.

**Data Engineering & Analytics Intern — Tech Mahindra · May 2026 – Jul 2026**

Render as a horizontal timeline rail with four pinned beats that advance as you scroll through the pinned section (ScrollTrigger `pin: true`, ~250vh scroll distance):

1. **Ingestion** — heterogeneous datasets across 3+ file formats, ~30% less manual preprocessing.
2. **Transformation** — reusable SQL and Spark transformations over telecom datasets, 100K+ records.
3. **Quality** — schema validation and missing-value handling across 5+ pipelines, ~20% fewer downstream errors.
4. **Delivery** — 3 Power BI dashboards for churn KPIs, revenue trends, retention.

The particle field is in "stream" mode here; each beat brightens one lane of the stream.

### 04 — Projects

Five projects. Layout: full-width rows, not a card grid. Each row is `min-height: 60vh`, hairline rule between rows, hovering a row triggers the particle cluster and lifts the row's ember accent.

Row anatomy:
```
04 / 01 ─────────────────────────────────────────────
SMRITIKOSH                                  [LIVE ●]
Multimodal personal memory retrieval
  ┌ what it does ─────────────────┐  PYTHON  CLIP
  │ 2–3 lines, plain language     │  QDRANT  KÙZUDB
  └───────────────────────────────┘  WHISPER  BLIP-2
  → GITHUB    → CASE NOTES
```

Project data (`src/data/projects.ts`) — use these, they're accurate:

**1. Smritikosh** — Multimodal personal memory retrieval system.
Ingests a personal photo/video/audio/document archive and answers natural-language questions about it. Seven-phase pipeline: multimodal extraction, episode segmentation, a memory graph, tiered scheduling with query-triggered deepening, entity resolution with correction propagation, and privacy-tiered routing. Validated end-to-end against a ~500-item real archive.
Stack: Python, CLIP, BLIP-2, Whisper, Qdrant, KùzuDB, FastAPI, React.
Links: `https://github.com/AbhijaySinghPanwar/Smritikosh`
Accent: iodine. Feature this one first — it's the deepest work.

**2. ResumeAI** — AI-powered ATS resume analysis platform.
Semantic resume-to-job matching across 10+ job categories, with parsing, ATS scoring, skill-gap analysis, AI rewriting and interview prep. Validated on 60+ real resumes. ONNX Runtime cut inference latency ~40%. Deployed on EC2 behind Nginx with RDS Postgres, secrets in SSM Parameter Store, migrations via Alembic.
Stack: FastAPI, Docker, AWS EC2, RDS PostgreSQL, Nginx, SQLAlchemy, Alembic, ONNX Runtime, sentence-transformers, Gemini API.
Links: GitHub + live demo — `TODO: fill URLs`
Accent: ember (deployed).

**3. Healthcare Appointment & Follow-up Manager** — Booking system that refuses to double-book.
A Postgres GiST exclusion constraint makes overlapping bookings impossible at the database level; a hold-then-confirm state machine (HELD → CONFIRMED/EXPIRED, 5-minute TTL) with SHA-256 idempotency keys and `SELECT FOR UPDATE SKIP LOCKED` handles concurrency. Groq LLM symptom triage, deterministic Google Calendar event IDs, node-cron reminders.
Stack: Node.js, Express, TypeScript, PostgreSQL, Prisma, React, JWT, Google Calendar OAuth 2.0.
Links: `https://github.com/AbhijaySinghPanwar/Healthcare-Appointment` · `https://healthcare-appointment-zeta.vercel.app`
Accent: ember. Lead the copy with the concurrency correctness angle — that's what makes it interesting.

**4. Connect-4 LLM Arena** — LLMs playing each other, out loud.
4+ models compete head-to-head while streaming their reasoning. ELO ratings, live leaderboard, match history across 100+ matches. Separate benchmark engine with alpha-beta minimax scoring and HTML reports, cutting manual model comparison time ~50%. Deployed on Hugging Face Spaces.
Stack: Python, Gradio, OpenAI, Gemini, Groq, MongoDB/SQLite.
Links: GitHub + HF Space — `TODO: fill URLs`
Accent: ember.

**5. SkillSwap** — Peer-to-peer skill exchange platform.
Full-stack matching platform with profiles, automated skill matching for 50+ test users, real-time chat and exchange-request workflows. JWT + bcrypt + Google OAuth 2.0 across protected routes.
Stack: Node.js, Express, MongoDB, JWT, Google OAuth 2.0, Bootstrap.
Links: `TODO: fill URLs`
Accent: iodine.

### 05 — Skills

Not a bar-chart or a percentage grid — those claim precision that doesn't exist. Render as a dense mono matrix, grouped exactly as the resume groups them (Languages / Frameworks / AI-ML / Data Engineering / Databases / Developer Tools). Each chip is `2px` radius, hairline border, `--muted` text; on hover the border goes iodine. Chips for anything that appears in a project above get a small ember dot, linking skill to evidence.

### 06 — Contact

Field converges to a breathing core. One oversized display-type mailto link, magnetic on hover. Below it, a mono row: email, phone, GitHub, LinkedIn, and a résumé download. Footer line: built-with credit, current year, and a mono timestamp of last deploy.

Certifications go here as a single compressed mono list (Udemy 100 Days of Python · Jul 2026, Udemy Full-Stack Bootcamp · May 2026, IBM GenAI with watsonx · Jun 2025, PW Skills C++ DSA · Jun 2024) — they're credentials, not a section.

---

## 5. Interaction details

- **Custom cursor** — a 6px bone dot plus a 32px hairline ring that lags ~120ms. Ring scales to 64px and inverts over links. Disabled on touch and when `pointer: coarse`.
- **Magnetic links** — nav pills and primary CTAs translate up to 8px toward the cursor within a 60px radius, spring back on leave.
- **Nav** — pill-shaped, top-right, `backdrop-filter: blur(12px)`, `--graphite` at 60% alpha, hairline border. Four items: `work`, `about`, `contact`, plus the résumé download. Active section's pill fills iodine at 12% alpha.
- **Sound toggle** — top-right, mono label, off by default. When on: a low ambient pad, plus a short click on query-pulse events. Persist choice in `localStorage`. **Never autoplay.**
- **Scroll** — Lenis with `lerp: 0.08`. Register `ScrollTrigger.scrollerProxy` against Lenis and call `lenis.on('scroll', ScrollTrigger.update)` — getting these out of sync is the usual source of jitter.
- **Text reveals** — clip-path mask reveals on section titles, 0.7s, `cubic-bezier(0.22, 1, 0.36, 1)`, triggered once at 60% viewport. No character-by-character stagger on body copy.

---

## 6. Non-negotiables

**Performance**
- 60fps on an M1 / mid-range laptop. Budget: JS under 250KB gzipped excluding three.js.
- Particle count adapts: 40k desktop, 15k tablet, 8k mobile, resolved once on mount from `window.devicePixelRatio` and a `matchMedia` check.
- `dpr={[1, 2]}` on the Canvas, never uncapped.
- All animation lives in shader uniforms or GSAP — never `setState` in `useFrame`.
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95.

**Reduced motion** — if `prefers-reduced-motion: reduce`: field renders static (single frame, no `useFrame` loop), all GSAP durations to 0.01, Lenis disabled, reveals become instant opacity. The site must be fully readable and navigable in this mode. Test it.

**Mobile** — the 3D stays but simplified: no cursor interaction, no pinned horizontal timeline (stack the four Tech Mahindra beats vertically), project rows become stacked cards, hero display type drops to `clamp(3rem, 13vw, 5rem)`. Tap targets ≥ 44px.

**Accessibility** — visible focus rings (2px iodine, 2px offset), semantic landmarks, `aria-label` on icon-only controls, canvas is `aria-hidden="true"`, skip-to-content link, colour contrast ≥ 4.5:1 for body text (`--muted` on `--ink` passes; verify before shipping).

**No-WebGL fallback** — detect context creation failure and render a static gradient-mesh PNG in place of the canvas. The site must not be blank.

---

## 7. Build phases

Work in order. Commit at each phase boundary. Show a screenshot before moving on.

- **P0 — Scaffold.** Next.js + TS + Tailwind v4, fonts loaded, tokens in `globals.css`, `src/data/*.ts` populated with the content from §4, empty section components stacked and scrolling. No 3D yet. *Done when:* the whole page reads correctly as a plain dark document.
- **P1 — Hero.** Canvas mounted, 40k-point sphere with idle drift and cursor repulsion, display type with the occlusion layering, load timeline. *Done when:* the hero alone is worth shipping.
- **P2 — Scroll engine.** Lenis + ScrollTrigger wired, `uProgress` driving field state transitions across all five states, section reveals. *Done when:* scrolling top to bottom morphs the field smoothly with no jank.
- **P3 — Sections.** About, Experience (pinned timeline), Skills, Contact built out against the data files.
- **P4 — Projects.** Rows, hover particle clusters, per-project accents, links.
- **P5 — Polish.** Custom cursor, magnetic links, sound toggle, query-pulse ripple, bloom pass tuning.
- **P6 — Hardening.** Reduced-motion path, mobile pass, WebGL fallback, Lighthouse, OG image, metadata, deploy to Vercel.

---

## 8. Ship checklist

- [ ] All `TODO: fill URLs` replaced with real links
- [ ] Résumé PDF in `/public`, linked from nav and contact
- [ ] `metadata` export: title, description, OG image, Twitter card
- [ ] `prefers-reduced-motion` verified in DevTools rendering panel
- [ ] Tested at 375px, 768px, 1440px, 2560px
- [ ] Keyboard-only pass: every link reachable, focus always visible
- [ ] Throttled to 4x CPU slowdown — still usable
- [ ] No console errors, no React strict-mode double-mount canvas leak
- [ ] No copy, asset, font or logo taken from either reference site

---

## 9. Things to actively avoid

Purple-to-blue gradient buttons. Glassmorphism cards. A "percentage skill bar" section. Typewriter effects on the hero. A hamburger menu on desktop. Stock 3D — no floating geometric shapes, no torus knots, no rotating dodecahedra. "Passionate about leveraging cutting-edge technology." A testimonials section (there are no testimonials). Fake metrics. A blog section with no posts. Confetti. Parallax on everything — parallax on one thing.
