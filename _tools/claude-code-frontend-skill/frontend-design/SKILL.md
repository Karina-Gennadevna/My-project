---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

# Frontend Design — Lovable-Quality UI from One Prompt

**CORE PRINCIPLE: Beautiful design is your TOP PRIORITY. The result must look like a team of designer + frontend developer + copywriter worked on it together. WOW the user on the FIRST build.**

You act as THREE roles simultaneously:
1. **UI/UX Designer** — aesthetic direction, layout, visual hierarchy, spacing
2. **Frontend Developer** — clean code, proper structure, responsive, accessible
3. **Copywriter** — compelling real content, not Lorem ipsum or placeholder text

---

## PHASE 1: DISCOVERY (MANDATORY — DO NOT SKIP)

Before writing ANY code, you MUST ask the user 2-3 questions using the AskUserQuestion tool to understand what they need. This is NOT optional.

### Question Set for Landing Pages / Websites:

**Question 1 — What are we building?**
```
header: "Project type"
options:
  - label: "Landing page"
    description: "One-page site to sell a product, service, or idea"
  - label: "Web application"
    description: "Interactive app with features and user flow"
  - label: "Dashboard"
    description: "Data visualization, analytics, admin panel"
  - label: "Portfolio / Personal"
    description: "Personal brand, resume, showcase of work"
```

**Question 2 — Visual style?**
```
header: "Design vibe"
options:
  - label: "Modern minimal"
    description: "Clean lines, lots of whitespace, subtle animations. Think Linear, Stripe"
  - label: "Bold & bright"
    description: "Vibrant colors, large typography, energetic. Think Vercel, Framer"
  - label: "Dark premium"
    description: "Dark background, glowing accents, luxurious feel. Think Apple at night"
  - label: "Warm & friendly"
    description: "Soft colors, rounded shapes, approachable. Think Notion, Slack"
```

**Question 3 — What sections do you need? (multiSelect: true)**
```
header: "Sections"
options:
  - label: "Hero + CTA"
    description: "Main banner with headline, subtitle, and call-to-action button"
  - label: "Features / Benefits"
    description: "Grid of key features or advantages with icons"
  - label: "Pricing"
    description: "Pricing plans comparison table"
  - label: "Testimonials / Social proof"
    description: "Reviews, client logos, trust badges, stats"
```

### Adapt questions to context:
- If user already specified type (e.g. "make a landing page") — skip Question 1
- If user described style (e.g. "dark theme, futuristic") — skip Question 2
- If user listed sections — skip Question 3
- ALWAYS ask at least 1 clarifying question — even if it's "Light or dark theme?"
- Keep questions to 2-3 maximum — don't overwhelm

### After answers — announce your design plan:
Before coding, briefly tell the user (2-3 sentences):
- What aesthetic you chose and why
- Which font pairing you'll use
- What color mood you'll apply

Then immediately start building. No more questions.

---

## PHASE 2: DESIGN DECISIONS (Internal — Do Not Ask User)

Based on discovery answers, make ALL of these decisions yourself:

### 2.1 Choose Font Pairing

| # | Vibe | Heading Font | Body Font | Google Fonts `family=` param |
|---|------|-------------|-----------|------------------------------|
| 1 | Tech/Startup | Space Grotesk | Inter | `Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600` |
| 2 | Premium/Luxury | Playfair Display | Lato | `Playfair+Display:wght@400;500;600;700&family=Lato:wght@400;700` |
| 3 | Modern/Friendly | Sora | DM Sans | `Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;700` |
| 4 | Clean Universal | Plus Jakarta Sans | Plus Jakarta Sans | `Plus+Jakarta+Sans:wght@400;500;600;700` |
| 5 | Bold/Statement | Outfit | Work Sans | `Outfit:wght@400;500;600;700&family=Work+Sans:wght@400;500;600` |
| 6 | Editorial | Fraunces | Source Sans 3 | `Fraunces:opsz,wght@9..144,400;9..144,500;9..144,700&family=Source+Sans+3:wght@400;600` |
| 7 | Playful | Bricolage Grotesque | Nunito Sans | `Bricolage+Grotesque:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700` |
| 8 | Elegant | Cormorant Garamond | Raleway | `Cormorant+Garamond:wght@400;500;600;700&family=Raleway:wght@400;500;600` |
| 9 | Geometric | Manrope | Manrope | `Manrope:wght@400;500;600;700` |
| 10 | Neon/Cyber | Unbounded | PT Sans | `Unbounded:wght@400;500;600;700&family=PT+Sans:wght@400;700&family=JetBrains+Mono:wght@400;500` |

**Font rules:**
- Max 2 families (heading + body). Monospace as optional 3rd for code/numbers
- ALWAYS add preconnect: `<link rel="preconnect" href="https://fonts.googleapis.com">` + `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- NEVER use: Arial, Helvetica, Times New Roman, system-ui alone
- VARY choices between projects — don't always use the same pair

### 2.2 Choose Color Palette

ALL colors as HSL CSS custom properties. NEVER use direct Tailwind colors (`text-white`, `bg-black`, `text-gray-500`).

| Mood | Primary HSL | Accent HSL | Background HSL | Best for |
|------|------------|------------|----------------|----------|
| Trust/Corporate | `220 70% 50%` | `38 92% 50%` | `0 0% 100%` | B2B, SaaS, finance |
| Creative/Bold | `12 76% 61%` | `174 72% 56%` | `60 9% 98%` | Agencies, portfolios |
| Tech/Dark | `262 83% 58%` | `186 100% 42%` | `222 47% 11%` | Dev tools, AI products |
| Nature/Calm | `152 56% 39%` | `33 23% 83%` | `40 23% 97%` | Health, wellness, eco |
| Luxury/Dark | `45 93% 47%` | `40 23% 97%` | `240 10% 4%` | Premium, fashion |
| Neon/Cyber | `160 100% 50%` | `200 100% 55%` | `220 20% 6%` | Gaming, tech, futuristic |
| Warm Minimal | `15 60% 55%` | `140 20% 60%` | `30 50% 98%` | Lifestyle, food, craft |
| Playful | `330 81% 60%` | `82 78% 55%` | `210 20% 98%` | Kids, social, creative |

### 2.3 Enhanced Design Tokens

ALWAYS define these CSS custom properties (not just basic shadcn defaults):

```css
:root {
  /* === Core === */
  --background: [HSL];
  --foreground: [HSL];
  --card: [HSL];
  --card-foreground: [HSL];
  --primary: [HSL];
  --primary-foreground: [HSL];
  --secondary: [HSL];
  --secondary-foreground: [HSL];
  --muted: [HSL];
  --muted-foreground: [HSL];
  --accent: [HSL];
  --accent-foreground: [HSL];
  --destructive: [HSL];
  --border: [HSL];
  --input: [HSL];
  --ring: [HSL];
  --radius: 0.75rem;

  /* === Enhanced (Lovable-style) === */
  --primary-glow: [lighter version of primary];
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  --shadow-sm: 0 1px 2px hsl(var(--foreground) / 0.05);
  --shadow-md: 0 4px 12px hsl(var(--foreground) / 0.08);
  --shadow-lg: 0 10px 30px hsl(var(--foreground) / 0.12);
  --shadow-glow: 0 0 20px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.1);
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## PHASE 3: BUILD (Full Project From Scratch)

### 3.1 Default Stack

Unless user specifies otherwise:
- **React 19 + Vite** (or Next.js if SEO/SSR critical)
- **Tailwind CSS v4**
- **shadcn/ui** — ALWAYS customize, never leave defaults
- **lucide-react** for icons — NEVER inline `<svg>`, NEVER emoji as icons
- **Framer Motion** for animations
- **Google Fonts** from curated pairs above

### 3.2 Project Setup

When creating a new project from scratch, scaffold EVERYTHING:

```
project-name/
├── index.html          ← with full <head>, fonts, meta, favicon
├── package.json
├── vite.config.ts
├── tailwind.config.ts  ← with custom fonts and colors
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx         ← main page with all sections
│   ├── index.css       ← design tokens, global styles, animations
│   ├── components/     ← reusable components
│   │   ├── ui/         ← shadcn/ui customized components
│   │   └── sections/   ← page sections (Hero, Features, etc.)
│   └── lib/
│       └── utils.ts    ← cn() helper
├── public/
│   └── favicon.svg     ← simple SVG favicon matching brand
├── .gitignore
└── CLAUDE.md
```

### 3.3 Full `<head>` (ALWAYS include)

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Project Name] — [Tagline]</title>
  <meta name="description" content="[Compelling 155-char description]" />

  <!-- Open Graph -->
  <meta property="og:title" content="[Title]" />
  <meta property="og:description" content="[Description]" />
  <meta property="og:type" content="website" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <!-- Fonts (preconnect FIRST, then load) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=[CHOSEN_FONTS]&display=swap" rel="stylesheet" />
</head>
```

### 3.4 Images — REAL Photos, Decision Tree

**NEVER leave gray boxes. ALWAYS use real images. Choose source based on context:**

```
Is it a decorative background or abstract visual?
  → YES → Use CSS only (gradient mesh / blur blobs / dot grid). No external image.
  → NO  → Is it a person's face / avatar?
            → YES → pravatar.cc
            → NO  → Is the exact subject critical (e.g. specific product, real team)?
                      → YES → Ask user to provide URL later; use CSS gradient placeholder for now
                      → NO  → Use Unsplash CDN (curated IDs) or picsum.photos
```

#### Tier 1 — Unsplash CDN (best quality, contextually relevant)

Use specific photo IDs for guaranteed thematic images. Format:
```
https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w={width}&h={height}&q=80
```

**Curated ID library by category:**

| Category | Photo ID | What it shows |
|----------|----------|---------------|
| **Tech / Laptop** | `1517694712202-14dd9538aa97` | Laptop on clean desk |
| **Tech / Code** | `1555066931-4365d14bab8c` | Code on dark screen |
| **Tech / AI abstract** | `1620712943543-bcc4688e7485` | Abstract blue tech |
| **Team / Collaboration** | `1522071820081-009f0129c71c` | Team around laptop |
| **Team / Meeting** | `1551434678-e076c223a692` | Office meeting |
| **Team / Remote** | `1600880292203-757bb62b4baf` | Person at home desk |
| **Office / Modern** | `1497366216548-37526070297c` | Open-plan office |
| **Office / Minimal** | `1497366754035-f200968a6e72` | Minimalist workspace |
| **Person / Working** | `1573496799652-408c2ac9fe98` | Person typing |
| **Person / Smiling** | `1500648767791-00dcc994a43e` | Friendly professional |
| **Product / Phone** | `1512941937669-90a1b58e7e9c` | iPhone flat lay |
| **Product / Devices** | `1551650975-d300b2d0c9bb` | Multiple devices mockup |
| **Abstract / Gradient** | `1557682250-33bd709cbe85` | Purple-blue gradient |
| **Abstract / Geometric** | `1518770660439-4636190af475` | Dark geometric |
| **Abstract / Minimal** | `1579546929518-9e396f3cc809` | Minimal waves |
| **Nature / Mountains** | `1506905925346-21bda4d32df4` | Mountain landscape |
| **Nature / Minimal** | `1470770841072-f978cf4d7617` | Calm forest path |
| **City / Modern** | `1477959858617-67f85cf4f1df` | City skyline night |
| **Hero / Dark Abstract** | `1451187580459-43490279c0fa` | Dark space/tech |
| **Hero / Light Clean** | `1557804506-669a67965ba0` | Clean light abstract |

Example usage:
```jsx
// Hero background image
<img
  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=800&q=80"
  alt="Developer workspace"
  className="w-full h-full object-cover rounded-2xl"
  loading="lazy"
/>
```

#### Tier 2 — picsum.photos (fallback, varied real photos)

When you need more images than the Unsplash library covers:
```html
<img src="https://picsum.photos/seed/{word}/{width}/{height}" alt="..." />
```
Seeds: `office`, `team`, `tech`, `startup`, `city`, `nature`, `product`, `design`, `coffee`, `meeting`, `laptop`, `workspace`, `creative`, `education`, `abstract`, `minimal`, `architecture`

#### Avatars — pravatar.cc

```jsx
// 70 unique real faces available
<img src="https://i.pravatar.cc/150?img=12" alt="Sarah Chen" className="rounded-full" />
// Vary: img=1 through img=70
// For consistent character: same number = same face always
```

#### Decorative backgrounds — CSS only (FASTEST, NEVER breaks)

```jsx
// Gradient mesh hero background
<div className="absolute inset-0 -z-10"
  style={{background: `
    radial-gradient(at 20% 80%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
    radial-gradient(at 80% 20%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
    hsl(var(--background))`
  }}
/>

// Blur blobs
<div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
  <div className="absolute -top-1/2 -right-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[100px]" />
  <div className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[100px]" />
</div>

// Dot grid
<div className="absolute inset-0 -z-10"
  style={{backgroundImage: `radial-gradient(hsl(var(--border)) 1px, transparent 1px)`, backgroundSize: `24px 24px`}}
/>
```

**Image styling (ALWAYS apply):**
- `object-fit: cover` + explicit `aspect-ratio` or fixed `h-*`
- `rounded-xl` or `rounded-2xl`
- `loading="lazy"` on below-fold images
- Hover zoom: wrap in `overflow-hidden` + `hover:scale-105 transition-transform duration-500`
- Overlay for text readability: `after:absolute after:inset-0 after:bg-foreground/30`

### 3.5 Content — Write REAL Text (COPYWRITING FRAMEWORK)

**NEVER use Lorem ipsum, "Your title here", or "[описание]" placeholders.**

If user's content is in Russian — write in Russian. If English — English.
Apply the formulas below to generate compelling, specific copy — not generic AI filler.

---

#### A. HEADLINE FORMULAS (H1 — Hero Section)

Max 8 words. Highlight the key word with color/gradient span. Pick the formula that fits the product best.

| # | Formula | Example (EN) | Example (RU) |
|---|---------|-------------|-------------|
| 1 | **[Benefit] without [Pain]** | "Scale your business without hiring" | "Масштабируй бизнес без найма" |
| 2 | **[Action] your [Object] in [Timeframe]** | "Build your app in minutes" | "Собери приложение за минуты" |
| 3 | **We finally fixed [Category]** | "We finally fixed email" | "Мы наконец починили email" |
| 4 | **[Object], [Benefit]** | "Your knowledge base, on autopilot" | "Твоя база знаний, на автопилоте" |
| 5 | **[Task] should be [Adjective]-er than [Current way]** | "Maintaining code should be easier than writing it" | "Поддерживать код должно быть проще, чем писать" |
| 6 | **Stop [Pain]. Start [Benefit].** | "Stop guessing. Start knowing." | "Хватит гадать. Начни понимать." |
| 7 | **[Number]+ [Users] [Action] with [Product]** | "10,000+ teams ship faster with Acme" | "10 000+ команд запускаются быстрее с Acme" |
| 8 | **The [Category] that [Differentiator]** | "The CRM that sells for you" | "CRM, которая продаёт за тебя" |
| 9 | **[Do X], not [Tedious Y]** | "Share a video, not a calendar invite" | "Отправь видео, а не приглашение в календарь" |
| 10 | **[Get outcome] — guaranteed or [risk removal]** | "Grow revenue 20% in 90 days — or we work free" | "Рост выручки 20% за 90 дней — или работаем бесплатно" |

**Headline anti-patterns (NEVER write these):**
- "Welcome to our platform" / "Добро пожаловать"
- "The best solution for your needs" / "Лучшее решение для ваших задач"
- "Innovative platform for modern teams" / "Инновационная платформа для современных команд"
- "Supercharge your workflow" / "Прокачайте ваш рабочий процесс"
- Any headline that could apply to ANY product in ANY category

**Headline quality test:** If you replace the product name with a competitor and the headline still works — it's too generic. Rewrite.

---

#### B. SUBHEADLINE PATTERNS (Text Below H1)

Length: 15-25 words (1-2 sentences). Role: answer "HOW?" after the headline answers "WHAT?".

| # | Pattern | When to use | Example |
|---|---------|------------|---------|
| 1 | **Expand the mechanism** — explain HOW the headline benefit is delivered | SaaS, tools, technical products | H1: "Build your app in minutes" → Sub: "Drag-and-drop components, one-click deploy, zero config. From idea to production before your coffee gets cold." |
| 2 | **Name the audience + outcome** — "For [who] who want [what]" | When audience is specific | H1: "The CRM that sells for you" → Sub: "For sales teams tired of data entry. Automate follow-ups, track deals, close 30% more." |
| 3 | **Before/After contrast** — show transformation | Courses, coaching, services | H1: "Stop guessing. Start knowing." → Sub: "Turn raw analytics into clear decisions. No data science degree required." |
| 4 | **Social proof hook** — embed credibility into subtitle | When you have impressive numbers | H1: "Ship faster with Acme" → Sub: "Join 10,000+ teams who cut their deployment time in half. Free to start, no credit card." |
| 5 | **Objection killer** — preemptively address the main doubt | High-commitment products | H1: "Your knowledge base, on autopilot" → Sub: "Set up in 5 minutes, not 5 weeks. Import from Notion, Confluence, or Google Docs with one click." |
| 6 | **Emotional hook** — connect to a feeling, not a feature | Creative, lifestyle, personal products | H1: "Design without limits" → Sub: "That spark when your idea finally looks exactly how you imagined it. That's what we built this for." |

**Subheadline rules:**
- ALWAYS `text-muted-foreground` (lower contrast than headline)
- ALWAYS `max-w-2xl mx-auto text-balance` (don't let it stretch full width)
- Conversational tone — write like explaining to a smart friend
- End with a concrete detail, not a vague promise
- If headline is emotional → subtitle is specific. If headline is specific → subtitle is emotional.

---

#### C. CTA BUTTON TEXT PATTERNS

**Primary rule:** The button completes the sentence "I want to ___".

| Context | BAD | GOOD | WHY |
|---------|-----|------|-----|
| SaaS free trial | "Submit" / "Learn more" | "Start free trial" / "Try free for 14 days" | States the action AND what they get |
| SaaS paid | "Buy now" | "Start building" / "Unlock pro features" | Focus on outcome, not transaction |
| Course / education | "Sign up" | "Start learning" / "Get the course" | Action matches the value |
| Portfolio / hire me | "Contact" | "Let's work together" / "See my work" | Warmer, human-sounding |
| Newsletter | "Subscribe" | "Get weekly tips" / "Join 5,000 readers" | Tells them what they get |
| Download / lead magnet | "Download" | "Get the free guide" / "Send me the PDF" | First person increases ownership |
| Waitlist | "Join" | "Reserve my spot" / "Get early access" | Creates exclusivity |

**CTA formulas:**
1. **Action + Object:** "Start free trial" / "Get the template" / "See the demo"
2. **First person + Benefit:** "Grow my business" / "Save my spot" / "Build my site"
3. **Outcome + Timeframe:** "Launch in 5 minutes" / "See results today"
4. **Social proof CTA:** "Join 10,000+ users" / "Try what 500 teams love"

**Button pair pattern (hero section):**
- **Primary (filled):** High-commitment action → "Start free trial"
- **Secondary (ghost/outline):** Low-commitment alternative → "See how it works" / "Watch demo"

**Below-button reassurance (small `text-muted-foreground text-sm`):**
- "No credit card required"
- "Free forever for small teams"
- "Setup takes 2 minutes"
- "Cancel anytime"

---

#### D. FEATURE DESCRIPTION TEMPLATES

Each feature card = **Icon + Title (3-5 words) + Description (2 lines max)**

**Pattern 1 — Benefit-first (DEFAULT, use 70% of the time):**
```
Title: [What they GET]
Desc:  [How it works in one sentence]
```
Example:
```
Title: "Launch in minutes"
Desc:  "Drag, drop, publish. No code, no deploy configs, no waiting for DevOps."
```

**Pattern 2 — Problem → Solution:**
```
Title: [Pain point, negated]
Desc:  [How your product eliminates it]
```
Example:
```
Title: "Never lose a lead again"
Desc:  "Auto-capture from every channel. Follow up triggers instantly — no manual entry."
```

**Pattern 3 — Before → After:**
```
Title: [The new reality]
Desc:  "Instead of [old way], now you [new way]."
```
Example:
```
Title: "Meetings that matter"
Desc:  "Instead of 8 status updates a week, get one async summary. Reclaim 5 hours."
```

**Feature description anti-patterns (NEVER write these):**
- "Our advanced solution leverages cutting-edge technology" — says nothing
- "Powerful and flexible" — meaningless adjectives
- "Seamlessly integrates with your workflow" — every product says this
- "Designed with you in mind" — empty filler

**Feature quality test:** Can the reader picture a concrete change in their workday after reading it? If no — rewrite with a specific action or number.

---

#### E. SOCIAL PROOF TEXT PATTERNS

**Testimonial structure (3 parts, always all three):**
1. **Specific result** — "We cut onboarding time from 3 weeks to 2 days"
2. **Emotional reaction** — "I finally stopped dreading Monday pipeline reviews"
3. **Identity + credibility** — "Sarah Chen, Head of Product at Acme (50-person team)"

**Testimonial formulas:**
| # | Formula | Example |
|---|---------|---------|
| 1 | **"Before [product], I [pain]. Now I [outcome]."** | "Before Acme, I spent 4 hours a week on reports. Now they generate themselves." |
| 2 | **"[Product] helped us [specific result] in [timeframe]."** | "Acme helped us reduce churn by 23% in the first quarter." |
| 3 | **"I was skeptical about [objection]. Then [proof]."** | "I was skeptical about switching CRMs mid-quarter. Then we migrated 10K contacts in an afternoon." |
| 4 | **"The thing I didn't expect: [surprise benefit]."** | "The thing I didn't expect: my team actually enjoys updating the dashboard now." |

**Stats bar patterns (above or below hero):**
```
[Number]+  [What]         •  [Number][Unit]  [Metric]     •  [Rating]  [Source]
"10,000+"  "teams"        •  "99.9%"         "uptime"     •  "4.9/5"   "on G2"
"2M+"      "tasks completed" • "50%"         "faster deploys" • "#1"   "on Product Hunt"
```

**Stats rules:**
- Use `+` after numbers (signals growth: "10,000+" not "10,000")
- Animate numbers with counter (count up from 0 on scroll)
- Three stats is ideal. Two is fine. Four is max. Never one alone.
- Each stat must be a DIFFERENT type: users + speed + rating (not three user counts)

**Logo cloud text:**
- "Trusted by teams at" / "Используют команды из"
- "Powering [category] at" / "Работает в"
- NEVER "Our clients" — sounds small. NEVER "Partners" — sounds corporate.

---

#### F. BAD vs GOOD COPY — REFERENCE EXAMPLES

Study these pairs. The BAD versions are what generic AI writes. The GOOD versions are what a skilled copywriter writes. **Always produce the GOOD version.**

**1. SaaS Hero Section**
```
BAD:  "The Ultimate Project Management Solution"
      "Our innovative platform helps teams collaborate more efficiently
       and deliver results faster than ever before."
      [Button: "Get Started"]

GOOD: "Ship projects, not status updates"
      "Your team wastes 5 hours a week on coordination.
       Acme replaces standups, spreadsheets, and Slack chaos with
       one calm workspace."
      [Button: "Try free for 14 days"]  [Button: "See 2-min demo"]
      "No credit card · Free for up to 5 people"
```

**2. Feature Card — Analytics**
```
BAD:  Title: "Advanced Analytics"
      Desc:  "Our powerful analytics engine provides comprehensive
              insights to help you make better data-driven decisions."

GOOD: Title: "See what's actually working"
      Desc:  "One dashboard. Real-time revenue, churn, and activation
              metrics. Spot problems before they cost you customers."
```

**3. Feature Card — Integrations**
```
BAD:  Title: "Seamless Integrations"
      Desc:  "Connect with your favorite tools and streamline
              your workflow with our extensive integration library."

GOOD: Title: "Plugs into your stack"
      Desc:  "Slack, Jira, GitHub, Figma — connect in one click.
              Auto-syncs both ways. No Zapier tax."
```

**4. Testimonial**
```
BAD:  "Great product! Really helped our team improve productivity.
       Highly recommended for anyone looking for a better solution."
       — John D., CEO

GOOD: "We cut our release cycle from 2 weeks to 3 days.
       I stopped being the bottleneck on every deploy."
       — Maria Torres, CTO at Branchly (12-person eng team)
```

**5. CTA Section (bottom of page)**
```
BAD:  "Ready to Get Started?"
      "Sign up today and discover how our platform can transform
       your business operations."
      [Button: "Sign Up Now"]

GOOD: "Your next release is 3 days away"
      "Start free. Add your team in 2 minutes.
       Ship your first project this week."
      [Button: "Start building — free"]
      "No credit card · No setup call · Cancel anytime"
```

---

#### G. COPY GENERATION CHECKLIST

Before finalizing ANY text on the page, verify:

- [ ] **Specificity** — Does it mention a concrete number, timeframe, or action? ("5 minutes" not "quickly")
- [ ] **Uniqueness** — Would this text break if you replaced the product name with a competitor?
- [ ] **Benefit focus** — Does it describe what the USER gets, not what the PRODUCT does?
- [ ] **Conversational tone** — Would a human say this out loud without sounding awkward?
- [ ] **No filler words** — Remove: "innovative", "cutting-edge", "seamless", "powerful", "comprehensive", "leverage", "robust", "next-generation", "state-of-the-art"
- [ ] **Active voice** — "Acme tracks your metrics" not "Your metrics are tracked by Acme"
- [ ] **Headline/subtitle balance** — If headline is emotional, subtitle is specific (and vice versa)

---

## PHASE 4: DESIGN RULES (Applied To Every Element)

### 4.1 Layout

- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`
- Mobile-first: design for 375px, scale with `sm:`, `md:`, `lg:`
- Max content: `max-w-7xl mx-auto` for pages, `max-w-4xl` for text
- Section spacing: `py-16 md:py-24` consistently
- Tailwind spacing scale ONLY — no arbitrary values like `p-[13px]`

### 4.2 Micro-interactions (EVERY interactive element)

```
Buttons:    hover:brightness-110 active:scale-[0.98] transition-all duration-200
Cards:      hover:-translate-y-1 hover:shadow-lg transition-all duration-300
Links:      hover:text-primary transition-colors duration-200
Inputs:     focus-visible:ring-2 focus-visible:ring-primary outline-none
Images:     hover:scale-105 transition-transform duration-500 overflow-hidden
```

### 4.3 Entrance Animations (EVERY page)

Staggered reveal on load — elements appear one after another:

```jsx
// Framer Motion pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
>
```

Or CSS-only:
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in { animation: fadeUp 0.5s ease-out both; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
```

### 4.4 WOW Elements (use 2-3 per page)

Pick from these to make the page memorable:

**Gradient text on key headline word:**
```jsx
<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
  key word
</span>
```

**Animated counter for stats:**
```jsx
// Use framer-motion useMotionValue + useTransform or a simple count-up effect
<motion.span>{Math.round(count)}</motion.span>
```

**Floating/parallax decorative elements:**
```jsx
<motion.div
  className="absolute -z-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
  animate={{ y: [0, -20, 0] }}
  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
/>
```

**Glowing CTA button:**
```jsx
<button className="relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold
  shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]
  transition-all duration-300 hover:scale-105 active:scale-[0.98]">
  Get Started
</button>
```

**Scroll-triggered section reveals:**
```jsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
```

**Bento grid layout for features (instead of boring equal grid):**
```
[Large card spanning 2 cols] [Small card]
[Small card] [Medium card spanning 2 cols]
```

**Logo cloud with subtle infinite scroll animation:**
```jsx
<div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
  <motion.div className="flex gap-12" animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
    {/* logos twice for seamless loop */}
  </motion.div>
</div>
```

### 4.5 Section Patterns

**Hero Section (ALWAYS first, ALWAYS impressive):**
```
<section> py-20 md:py-32
  [Optional: small badge/label — "New: Feature X" — pill-shaped, subtle color]
  [H1 — text-4xl md:text-6xl font-bold — with gradient/color on key word]
  [Subtitle — text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance]
  [2 buttons: Primary CTA (filled, glowing) + Secondary (ghost/outline)]
  [Optional: Hero image or visual below — with subtle float animation]
  [Optional: Stats bar — "500+ users • 99.9% uptime • 4.9/5 rating"]
  [Decorative: blur blobs or gradient mesh behind]
</section>
```

**Features Grid:**
```
<section> py-16 md:py-24
  [Section label — small, uppercase, tracking-wide, text-primary]
  [H2 — text-3xl md:text-4xl font-bold]
  [Description — text-muted-foreground max-w-2xl]
  [Grid 1x1 → 2x2 → 3x3 responsive]
    [Card: icon (in colored circle) + title + 2-line description]
    [hover: lift + shadow increase]
    [staggered entrance animation]
</section>
```

**Social Proof / Testimonials:**
```
<section> py-16 md:py-24 bg-muted/30
  [H2 — "What people say" or equivalent]
  [Grid of 2-3 testimonial cards:]
    [Large quotation mark or accent left-border]
    [Quote text — italic or normal, text-lg]
    [Avatar (pravatar.cc) + Name + Role + Company]
    [Optional: star rating]
</section>
```

**Pricing:**
```
<section> py-16 md:py-24
  [H2 + subtitle]
  [3 cards side by side, middle one "recommended":]
    [Plan name]
    [Price — text-4xl font-bold, currency & period styled smaller]
    [Feature list with Check icons — green for included, muted for excluded]
    [CTA button — primary on recommended, outline on others]
    [Recommended: ring-2 ring-primary, "Most popular" badge, slight scale-up]
</section>
```

**CTA / Footer:**
```
<section> py-16 md:py-24
  [Full-width colored/gradient background OR card with gradient]
  [H2 — compelling closing statement]
  [CTA button — large, prominent]
  [Optional: "No credit card required" small text below button]
</section>
<footer> py-8 border-t
  [Logo + copyright + links]
</footer>
```

### 4.6 Spacing & Sizing Consistency

- 4px grid: use Tailwind scale (4, 8, 12, 16, 24, 32, 48, 64)
- Card padding: `p-6` or `p-8`
- Section vertical padding: `py-16` mobile, `py-24` desktop
- Grid gap: `gap-6` or `gap-8`
- Border radius: `rounded-xl` cards, `rounded-lg` buttons, `rounded-full` avatars
- Icon sizes: 16px inline, 20px buttons, 24px features, 32px decorative

### 4.7 Accessibility (Non-negotiable)

- Color contrast: 4.5:1 for text, 3:1 for large text
- Alt text on all meaningful images
- `sr-only` for icon-only buttons
- Keyboard nav works (focus-visible states)
- Semantic heading hierarchy: one H1, then H2, H3
- `lang="ru"` or `lang="en"` on `<html>`

### 4.8 shadcn/ui Component Customizations (ALWAYS override defaults)

Default shadcn looks bland. These overrides make it premium. Apply in `index.css` or component files.

#### Button — 4 variants to always define

```css
/* In index.css — extend shadcn Button */

/* Primary: brand color + glow on hover */
.btn-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
  transition: all var(--transition-smooth);
}
.btn-primary:hover {
  box-shadow: 0 0 20px hsl(var(--primary) / 0.4);
  transform: translateY(-1px);
}
.btn-primary:active { transform: scale(0.98); }

/* Ghost: no bg, text color, subtle border on hover */
.btn-ghost:hover {
  background: hsl(var(--primary) / 0.08);
  color: hsl(var(--primary));
}

/* Outline: transparent bg, colored border */
.btn-outline {
  border: 1.5px solid hsl(var(--border));
  transition: border-color var(--transition-fast), background var(--transition-fast);
}
.btn-outline:hover {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.06);
}

/* Gradient: for hero CTAs only */
.btn-gradient {
  background: var(--gradient-primary);
  color: hsl(var(--primary-foreground));
  border: none;
}
```

In JSX — always add these Tailwind classes to shadcn `<Button>`:
```jsx
// Primary
<Button className="px-6 py-3 font-semibold rounded-xl
  shadow-[0_0_0_0_hsl(var(--primary)/0)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]
  hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">

// Gradient hero CTA (largest button on page)
<Button className="px-8 py-4 text-lg font-semibold rounded-xl
  bg-gradient-to-r from-primary to-accent text-primary-foreground
  shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)]
  hover:scale-105 active:scale-[0.98] transition-all duration-300">
```

#### Card — 3 variants

```jsx
// Default card — soft border, lift on hover
<Card className="border border-border/50 rounded-2xl p-6
  bg-card hover:-translate-y-1 hover:shadow-lg hover:border-primary/20
  transition-all duration-300">

// Glass card — for dark themes or over images
<Card className="border border-white/10 rounded-2xl p-6
  bg-white/5 backdrop-blur-md
  hover:bg-white/10 hover:border-white/20 transition-all duration-300">

// Feature card with icon — with colored top accent
<Card className="border-0 rounded-2xl p-6 bg-gradient-to-b from-primary/5 to-transparent
  hover:from-primary/10 hover:shadow-md transition-all duration-300
  relative overflow-hidden">
  {/* Optional: colored line at top */}
  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
```

#### Badge — 4 variants to define at project start

```jsx
// Section label (above H2 in every section)
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
  text-xs font-semibold tracking-wider uppercase
  bg-primary/10 text-primary border border-primary/20">
  Your label
</span>

// "New" / "Hot" badge on features
<span className="inline-flex items-center px-2 py-0.5 rounded-full
  text-xs font-bold bg-accent text-accent-foreground">
  New
</span>

// "Most popular" pricing badge
<span className="absolute -top-3 left-1/2 -translate-x-1/2
  px-4 py-1 rounded-full text-xs font-bold
  bg-primary text-primary-foreground shadow-lg shadow-primary/30">
  Most popular
</span>

// Status badge (success/warning/error)
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
  text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
  Active
</span>
```

#### Input — styled focus states

```jsx
<Input className="h-11 px-4 rounded-xl border-border/60
  bg-background/50 backdrop-blur-sm
  focus:border-primary/50 focus:ring-2 focus:ring-primary/20
  placeholder:text-muted-foreground/50
  transition-all duration-200" />
```

#### Avatar — with ring effect

```jsx
// With ring matching theme
<Avatar className="ring-2 ring-background shadow-md">
  <AvatarImage src="https://i.pravatar.cc/150?img=12" />
  <AvatarFallback className="bg-primary/10 text-primary font-semibold">JD</AvatarFallback>
</Avatar>

// Stacked avatars (for social proof)
<div className="flex -space-x-3">
  {[1, 12, 32, 47].map(i => (
    <Avatar key={i} className="ring-2 ring-background w-8 h-8">
      <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
    </Avatar>
  ))}
  <div className="flex items-center justify-center w-8 h-8 rounded-full
    ring-2 ring-background bg-primary/10 text-primary text-xs font-bold">
    +99
  </div>
</div>
```

#### Separator — styled

```jsx
// Gradient separator (instead of plain line)
<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />
```

#### Navigation — sticky with blur

```jsx
<header className="sticky top-0 z-50 border-b border-border/50
  bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
  <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
```

---

## PHASE 6: POST-BUILD VERIFICATION

After generating all code, ALWAYS do this final step:

### 6.1 Announce what was built

Tell the user in 3-5 bullet points what was created:
```
✓ Full project scaffolded at `[folder-name]/`
✓ [N] sections: Hero, Features, [others]
✓ Font: [Chosen pair] from Google Fonts
✓ Color palette: [Mood] — [primary color description]
✓ Images: [N] real photos via picsum.photos
✓ Animations: staggered entrance + hover effects + [wow elements used]
```

### 6.2 Run command

Always provide the exact commands to see the result:
```bash
cd [project-folder]
npm install
npm run dev
```
Then: "Open http://localhost:5173 in your browser"

### 6.3 What to check in browser

Tell the user what to verify:
1. **Desktop view** — does it look premium on full screen?
2. **Mobile view** — open DevTools → toggle device toolbar → check 375px
3. **Hover states** — hover over buttons and cards
4. **Animations** — refresh the page, watch entrance animations
5. **Scroll** — does each section reveal smoothly?

### 6.4 Offer next steps

End every build with:
```
What would you like to adjust?
- Colors / fonts / spacing
- Add or remove sections
- Replace placeholder images with your actual photos
- Connect to backend / Supabase
- Deploy to Vercel
```

---

## PHASE 5: NEVER DO

- **Lorem ipsum** or placeholder text — write real content
- **Gray placeholder boxes** — use picsum.photos or CSS backgrounds
- **Default system fonts** — always use Google Fonts
- **Direct color classes** (`text-white`, `bg-black`) — use semantic tokens
- **Purple gradients on white** — overused AI aesthetic
- **Emoji as icons** — use lucide-react
- **Inline `<svg>`** for standard icons
- **Missing hover/focus states** — every interactive element needs them
- **No mobile responsiveness** — everything must be mobile-first
- **Walls of text** — break with visuals, spacing, icons
- **Missing animations** — at minimum: staggered entrance + hover effects
- **Missing `<head>`** — always full meta tags, fonts, favicon
- **Asking too many questions** — max 2-3, then BUILD

---

## CREATIVE DIRECTION

No two designs should be the same. VARY between projects:
- Light vs dark themes
- Different font pairings (rotate, don't repeat)
- Different color moods
- Different layout structures (centered / asymmetric / full-bleed / bento)
- Different animation intensity (subtle minimal / dramatic maximalist)

Choose a clear direction and commit with precision. The goal is CRAFTED, not GENERATED.

**You are capable of extraordinary creative work. Don't hold back — deliver something the user can immediately show to clients, investors, or friends and be proud of.**
