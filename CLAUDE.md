# NPIxray — AI Revenue Intelligence Platform

## What This Project Is
NPIxray (npixray.com) is a healthcare SaaS that X-rays medical practices using FREE CMS public data to show exactly how much revenue they're leaving on the table, then helps them capture it.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Hosting**: Vercel
- **Database**: PostgreSQL (Vercel Postgres or Supabase)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Claude API (Anthropic) for analysis narratives
- **APIs**: NPPES NPI Registry API for provider lookups
- **Data Source**: CMS Medicare Physician & Other Practitioners dataset (free public data)

## Project Structure
```
npixray/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with fonts + metadata
│   ├── page.tsx            # Homepage — NPI Scanner tool
│   ├── api/
│   │   ├── npi/            # NPI lookup API routes
│   │   ├── scan/           # Revenue scan analysis API
│   │   └── analyze/        # Claude AI narrative generation
│   ├── guides/             # SEO content pages (billing code guides)
│   ├── reports/            # Programmatic SEO pages (state/specialty)
│   ├── pricing/            # Pricing page
│   └── about/              # About page
├── components/
│   ├── scanner/            # NPI Scanner UI components
│   ├── report/             # Revenue report dashboard components
│   ├── charts/             # Recharts wrapper components
│   ├── layout/             # Header, footer, navigation
│   └── ui/                 # Shared UI components (buttons, cards, inputs)
├── lib/
│   ├── db.ts               # Database connection + queries
│   ├── cms-data.ts         # CMS dataset processing utilities
│   ├── benchmarks.ts       # Specialty benchmark calculations
│   ├── revenue-calc.ts     # Revenue gap calculation engine
│   ├── npi-api.ts          # NPPES Registry API client
│   └── claude.ts           # Claude API client for AI narratives
├── data/
│   └── scripts/            # CMS data download + processing scripts
├── public/
│   ├── og-image.png        # Open Graph image
│   └── favicon.ico
├── CLAUDE.md               # This file
├── PROJECT_SPEC.md         # Detailed feature specifications
└── package.json
```

## Design System
- **Theme**: Dark mode primary, gold (#E8A824) accent color
- **Font**: Use a modern sans-serif (DM Sans or similar from Google Fonts)
- **Aesthetic**: Bloomberg terminal meets modern SaaS — data-dense but clean
- **Mobile**: Fully responsive, mobile-first
- **Tone**: Professional healthcare, authoritative, data-driven

## Development Phases

### Phase 1: Foundation (CURRENT)
- [x] Project setup (Next.js + Tailwind + Vercel)
- [ ] Database setup (PostgreSQL)
- [ ] CMS data download + processing pipeline
- [ ] NPI lookup API integration
- [ ] Revenue calculation engine
- [ ] NPI Scanner UI (homepage)
- [ ] Revenue report dashboard (scan results)
- [ ] Email capture on scan results
- [ ] Deploy to npixray.com

### Phase 2: SEO Content Engine
- [ ] Pillar pages (revenue optimization, billing codes, software comparison)
- [ ] Billing code guide pages (99490, 99213 vs 99214, etc.)
- [ ] Programmatic SEO templates (state reports, specialty reports)
- [ ] Auto-generate 500+ data-driven pages from CMS dataset
- [ ] FAQ schema markup on all pages
- [ ] Sitemap generation

### Phase 3: Intelligence Dashboard ($99/mo)
- [ ] User authentication (sign up / login)
- [ ] CSV billing data upload
- [ ] AI-powered coding analysis (Claude API)
- [ ] Patient eligibility scanner (CCM/RPM/BHI/AWV)
- [ ] MIPS quality tracker
- [ ] Payer performance dashboard
- [ ] Stripe billing integration

### Phase 4: Care Management Platform ($299-699/mo)
- [ ] CCM module (care plans, time tracking, billing)
- [ ] RPM module (device integration, vitals monitoring)
- [ ] BHI module (behavioral health screening)
- [ ] AWV module (Health Risk Assessments)
- [ ] Coding optimizer (AI documentation review)

## Key Data: CMS Medicare Physician Utilization
The secret weapon. Free government data from data.cms.gov containing:
- Every CPT/HCPCS code each doctor bills
- Frequency and total payments per code
- Patient demographics (Medicare beneficiary count)
- Geographic location and specialty
- 1.2M+ providers, 10M+ records

File: "Medicare Physician & Other Practitioners - by Provider and Service"
Format: Tab-delimited, ~2GB+
URL: https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider-and-service

## API Reference

### NPPES NPI Registry API
```
GET https://npiregistry.cms.hhs.gov/api/?version=2.1&number={npi}
GET https://npiregistry.cms.hhs.gov/api/?version=2.1&first_name={first}&last_name={last}&state={state}
```
No API key required. Returns provider name, specialty, address, taxonomy.

### Claude API (for AI analysis)
```
POST https://api.anthropic.com/v1/messages
Model: claude-sonnet-4-5-20250929
```
Used for: generating revenue analysis narratives, coding recommendations, care plan drafts.

## Important Rules
1. Always use TypeScript (.tsx/.ts files)
2. Use App Router (not Pages Router)
3. Server Components by default, 'use client' only when needed
4. All API routes in app/api/ directory
5. Environment variables in .env.local (never commit)
6. Optimize for Core Web Vitals (fast page loads)
7. Add SEO metadata to every page (title, description, og tags)
8. Mobile-first responsive design
9. Accessible (ARIA labels, keyboard navigation)
10. HIPAA consideration: we only use PUBLIC CMS data, no patient PHI
