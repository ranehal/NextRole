# 🎯 NextRole · SOTA Job Analytics & Application Tracker

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Supabase Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![React 18](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite 6](https://img.shields.io/badge/Bundler-Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Security Hardened](https://img.shields.io/badge/Security-Cyberattack_Proof-blueviolet?style=for-the-badge&logo=shield)](vercel.json)

A state-of-the-art Job Analytics and Application Tracking platform engineered for modern tech job portals and recruitment ecosystems. Features a local-first reactive UI built with **React 18 + Vite 6 + Tailwind CSS**, cloud persistence via **Supabase**, and production-ready, cyberattack-proof deployment on **Vercel** and **GitHub Pages**.

Following **YAGNI** principles, local-first performance, zero-signup cookie persistence, and **one-liner operational simplicity**.

---

## ✨ Key Features & Capabilities

- 🤖 **Smart Ostad Auto-Search Replacement**: Automatically detects internal job portal links (`ostad.com` / `ostad.app`) and seamlessly converts the primary action button to **Auto Search** (direct Google search for `[Role Title] [Company Name]`), while preserving verified **Direct Apply** links for external careers pages, LinkedIn, and application forms.
- 🎨 **Zebra Striped Rows for Scannability**: Distinct alternating row contrasts (`#FDFBF7` even vs `#ECE5D8` tactile sand odd in light mode; `#12100E` even vs `#181613` odd in dark mode) ensuring effortless scanning across all 9 data table columns.
- 🏢 **Colorised Same Company Branding**: Deterministic 12-palette company color engine. All roles from the same company (e.g. Brandsquare, CSM Bangladesh, micro1, Eshal AI) share an identical signature badge, dot indicator, and border styling, with instant 1-click company filtering.
- 🔎 **2x More Hover Zoom on Company Logos**: Hovering over company cards scales logos by **8.4x** (`scale-[8.4]`, 2x larger than previous iterations) with `transform-gpu` acceleration, elevated `z-[99999]` depth, glowing orange ring accents, and deep drop shadows.
- ⚡ **Powerful Local-First Cache System**:
  - **Zero-Latency Startup**: Datasets are cached in `localStorage`; returning users experience 0ms load times with zero layout shift or spinner delay.
  - **Fetch Once (Don't Fetch Same Twice)**: Once data is fetched, the app operates completely local-first without redundant network roundtrips.
  - **Targeted JD Description Cache**: Full job descriptions are cached locally upon first read, opening instantly on subsequent views.
  - **Full State & Filter Memory**: Automatically preserves theme, custom freshness day thresholds, active tab, search queries, category filters, experience levels, selected skills, work modes, and sort directions across browser restarts.
  - **Zero-Signup Progress**: Checkbox progress is saved in `localStorage` and mirrored to browser cookies (`job_analytics_applied`).
- 🛡️ **Vercel Push Ready & Cyberattack-Proof**:
  - **Payload Validation & Sanitization**: Strict URL validation, boolean enforcement, and payload size bounds prevent XSS, prototype pollution, and SQL/parameter injection.
  - **Strict HTTP Security Headers**: Hardened in `vercel.json` with Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (HSTS), and restrictive `Permissions-Policy`.
- 📊 **Shifted Header Analytics Ribbon**: Top executive KPIs (`Total`, `Active`, `New Today`, `Closing Soon`, `Passed`, `Applied %`, `Direct Mails`) are consolidated in the header, with a collapsible deep **Analytics Insights Deck** featuring velocity funnel charts and skill leaderboards.
- ↕️ **Interactive All-Column Sorting**: Bidirectional sorting (`▲` / `▼` / `↕`) across every table column: `#` (Index), `Applied`, `Role & Categorisation`, `Company`, `Skills Count`, `Mode`, `Salary`, `Email Availability`, and `Deadline`.
- ✉️ **Direct HR Email Actions**: 1-click `mailto:` launch and clipboard copy buttons for verified recruiter email addresses.

---

## 🏗️ Architecture & SOTA Stack

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ NextRole Web Client (React 18 + Vite 6 + Tailwind CSS)                                          │
│ • Local-First Cache (src/cache.js): Settings, Filters, Progress, Jobs                           │
│ • Zebra Striped Rows & Colorised Company Badges                                                │
│ • 8.4x GPU-Accelerated Logo Hover Zoom                                                          │
│ • Smart Link Detection ──► Auto Search Swapping                                                 │
└─────────────────────────────────┬─────────────────────────────┬─────────────────────────────────┘
                                  │                             │
                                  ▼                             ▼
                    ┌───────────────────────────┐ ┌───────────────────────────┐
                    │     Local Data Files      │ │   Supabase Cloud DB       │
                    │      public/jobs.json     │ │   (public.jobs table)     │
                    └───────────────────────────┘ └───────────────────────────┘
```

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | React 18, Vite 6, Tailwind CSS | Ultra-fast dashboard, responsive data table, real-time search, filters, and JD slide-over drawer |
| **Cache Engine** | `src/cache.js` (LocalStorage + Cookies) | Local-first persistence of settings, filters, progress, and datasets |
| **Cloud Database** | [Supabase](https://supabase.com) PostgreSQL | Automated cloud synchronization of vacancies, application states, and discovery timestamps |
| **Data Storage** | `public/jobs.json` | Tabular datasets for zero-latency local review |
| **Deployment** | Vercel / GitHub Pages | Static hosting with SPA routing and edge security headers |

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## ☁️ Vercel & GitHub Pages Deployment

NextRole is pre-configured with [`vercel.json`](vercel.json) for instant deployment to Vercel, and `.github/workflows/deploy.yml` for automated GitHub Pages hosting.

### 1-Click CLI Deployment
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy to Vercel
vercel
```

### Git-Integrated Deployment (GitHub)
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: production ready NextRole frontend"
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project** and choose your repository.
3. Configure Environment Variables (Optional):
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_SECRET_KEY`: `your-supabase-service-role-key`
4. Click **Deploy**.

---

## 🛡️ Cybersecurity & Privacy Architecture

NextRole adheres to rigorous web application security and user privacy standards:

1. **HTTP Security Headers (`vercel.json`)**:
   - **Content-Security-Policy (CSP)**: Locks script, font, image, and connect sources to trusted endpoints (`self`, Supabase, Ostad CDN, Google Fonts, and Google Search).
   - **X-Frame-Options (`DENY`)**: Eliminates clickjacking risks.
   - **X-Content-Type-Options (`nosniff`)**: Prevents MIME-type confusion attacks.
   - **Referrer-Policy (`strict-origin-when-cross-origin`)**: Protects user browsing context on external links.
   - **Permissions-Policy**: Disables camera, microphone, geolocation, and payment APIs for total user privacy.
   - **Strict-Transport-Security (`HSTS`)**: Enforces HTTPS connections with subdomains included.
   - **Cross-Origin-Opener-Policy (`same-origin`)**: Protects against Spectre and cross-origin side-channel leaks.

---

## ⚡ Supabase Cloud Database Setup

### Table Schema
To initialize or verify your table, run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.jobs (
    live_url text PRIMARY KEY,
    applied boolean DEFAULT false,
    title text,
    company text,
    appeard_datetime text,
    disappeared_datetime text,
    local_txt_url text,
    salary text,
    remote_onsite text,
    employment_type text,
    deadline text,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON public.jobs FOR UPDATE USING (true);
CREATE POLICY "Allow service key full access" ON public.jobs FOR ALL USING (true);
```

---

## 🧠 Multi-Tier Experience Level Detection Engine

NextRole classifies experience requirements using a **6-stage hierarchical decision engine** combining role title parsing, numerical regex patterns, age pattern filtering, and fresher phrase analysis:

```
                          [Job Posting]
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ Tier 1: Title Seniority Direct Detection                     │
   │ • "intern", "internship", "trainee", "apprentice" ──► Trainee│
   │ • "junior", "jr.", "associate", "entry level"    ──► Junior  │
   │ • "senior", "sr.", "lead", "principal", "manager"──► Senior  │
   └──────────────────────────────────────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ Tier 2: Age Pattern Stripping                                │
   │ • Strips "Age: 22-32 years" and "18 to 32 years of age"      │
   │   to prevent age limits from being confused with experience! │
   └──────────────────────────────────────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ Tier 3: Numerical Years of Experience Extraction             │
   │ • Extracts "X to Y years", "X+ years", "minimum X years"     │
   │   • min >= 5 yrs or max >= 6 yrs               ──► Senior    │
   │   • max <= 2 yrs (e.g. 0-2 yrs, 1-2 yrs)       ──► Junior    │
   │   • 2 to 5 yrs                                 ──► Mid Level │
   └──────────────────────────────────────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ Tier 4: Fresher / Zero-Experience Phrase Detection           │
   │ • "no prior experience needed", "freshers are welcome",      │
   │   "fresh graduates encouraged", "0-1 year"     ──► Junior    │
   └──────────────────────────────────────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ Tier 5: Title Keyword Resolution                             │
   │ • Resolves any remaining title senior/junior designations    │
   └──────────────────────────────────────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ Tier 6: Industry Standard Default                            │
   │ • Unspecified developer openings default to    ──► Mid Level │
   └──────────────────────────────────────────────────────────────┘
```

---

## 🤝 UI Verification & Showcase

- **Light Theme Showcase**: [`showcase/01_full_dashboard_light.png`](showcase/01_full_dashboard_light.png)
- **Dark Theme Showcase**: [`showcase/06_full_dashboard_dark.png`](showcase/06_full_dashboard_dark.png)
- **Striped Rows & Colorised Companies**: [`showcase/test_table_striped_colorised.png`](showcase/test_table_striped_colorised.png)
- **2x More Hover Zoom on Company Cards**: [`showcase/test_user_hover_zoom.png`](showcase/test_user_hover_zoom.png)
- **Targeted JD Drawer with Auto Search**: [`showcase/test_drawer_ostad_autosearch.png`](showcase/test_drawer_ostad_autosearch.png)

---

## 📄 License

MIT License. Engineered with pride for developers and job seekers everywhere.
