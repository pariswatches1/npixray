# NPIxray — Project Specification

## Overview
NPIxray is an AI Revenue Intelligence Platform for medical practices. It uses free CMS (Centers for Medicare & Medicaid Services) public data to analyze any medical practice by NPI number and show exactly how much revenue they're leaving on the table.

## Three-Layer Architecture

### Layer 1: FREE NPI Scanner (Lead Generator)
The viral hook. No login, no credit card. Office manager types doctor's NPI → gets full revenue analysis in seconds.

**Scanner Flow:**
1. User lands on npixray.com
2. Enters 10-digit NPI number OR searches by provider name
3. System looks up provider via NPPES API (name, specialty, location)
4. System queries CMS dataset for that NPI's billing data
5. Revenue calculation engine computes gaps across 5 categories
6. Displays interactive revenue report with charts
7. Email capture: "Enter email for full PDF report"

**Revenue Gap Categories:**
- **E&M Coding Gap**: Compare provider's 99213/99214/99215 distribution vs specialty benchmark. Calculate dollar impact of undercoding.
- **CCM Gap (99490)**: Based on chronic condition rates in patient panel, estimate eligible patients × $66-144/patient/month. Show how many CCM codes this NPI currently bills (from CMS data) vs potential.
- **RPM Gap (99453-99458)**: Estimate remote monitoring eligible patients. Show current RPM billing vs potential.
- **BHI Gap (99484)**: Based on behavioral health indicators in patient panel. Show current vs potential.
- **AWV Gap (G0438/G0439)**: Compare Annual Wellness Visit completion rate vs benchmark. Calculate missed visits × $118-174/visit.

**Report Dashboard Tabs:**
1. **Overview**: Total missed revenue (big number), pie chart breakdown by category, AI-generated narrative summary
2. **Programs**: Detailed cards for CCM/RPM/BHI/AWV — eligible patients, current billing, potential revenue, capture rate
3. **Coding**: E&M code distribution bar chart (current vs optimal), coding gap dollar amount
4. **Action Plan**: 90-day revenue capture roadmap with priorities

**Benchmark Data by Specialty:**
Store benchmarks for: Family Medicine, Internal Medicine, Cardiology, Pulmonology, Endocrinology, General Practice, Orthopedics, Gastroenterology, Neurology, Psychiatry, Urology, Rheumatology, Nephrology, Dermatology, OB/GYN

Each specialty has:
- Average Medicare patients per provider
- Average revenue per patient
- CCM/RPM/BHI/AWV adoption rates (% of providers billing these codes)
- Optimal E&M code distribution (99213/99214/99215 split)
- Average chronic condition rates (diabetes, hypertension, heart failure, COPD, depression)

### Layer 2: Intelligence Dashboard ($99/month) — Phase 3
- CSV upload of practice billing data
- AI coding analysis (Claude API reviews code patterns)
- Patient eligibility scanner (name-level lists for CCM/RPM/BHI/AWV)
- MIPS quality tracker
- Payer performance dashboard
- Peer benchmarking using CMS data

### Layer 3: Revenue Capture Platform ($299-699/month) — Phase 4
- CCM Module: AI care plans, patient outreach, time tracking
- RPM Module: device partner integration, vitals monitoring
- BHI Module: PHQ-9/GAD-7 screening, behavioral health tracking
- AWV Module: Health Risk Assessment templates, screening tools

---

## Database Schema (PostgreSQL)

### Table: cms_providers
Aggregated from CMS dataset — one row per NPI
```sql
CREATE TABLE cms_providers (
  npi VARCHAR(10) PRIMARY KEY,
  provider_name VARCHAR(255),
  specialty VARCHAR(100),
  state VARCHAR(2),
  city VARCHAR(100),
  zip VARCHAR(10),
  total_medicare_patients INTEGER,
  total_services INTEGER,
  total_medicare_payment DECIMAL(12,2),
  total_submitted_charges DECIMAL(12,2),
  avg_medicare_payment_per_service DECIMAL(8,2),
  hcc_risk_score DECIMAL(4,2),
  beneficiary_avg_age DECIMAL(4,1),
  beneficiary_female_pct DECIMAL(5,2),
  chronic_diabetes_pct DECIMAL(5,2),
  chronic_hypertension_pct DECIMAL(5,2),
  chronic_heart_failure_pct DECIMAL(5,2),
  chronic_depression_pct DECIMAL(5,2),
  chronic_copd_pct DECIMAL(5,2),
  data_year INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: cms_provider_services
One row per NPI + HCPCS code combination
```sql
CREATE TABLE cms_provider_services (
  id SERIAL PRIMARY KEY,
  npi VARCHAR(10),
  hcpcs_code VARCHAR(10),
  hcpcs_description VARCHAR(255),
  service_count INTEGER,
  beneficiary_count INTEGER,
  avg_medicare_payment DECIMAL(8,2),
  total_medicare_payment DECIMAL(12,2),
  avg_submitted_charge DECIMAL(8,2),
  total_submitted_charges DECIMAL(12,2),
  place_of_service CHAR(1), -- F=facility, O=office
  data_year INTEGER,
  FOREIGN KEY (npi) REFERENCES cms_providers(npi)
);
CREATE INDEX idx_services_npi ON cms_provider_services(npi);
CREATE INDEX idx_services_hcpcs ON cms_provider_services(hcpcs_code);
```

### Table: specialty_benchmarks
Pre-calculated benchmarks per specialty
```sql
CREATE TABLE specialty_benchmarks (
  specialty VARCHAR(100) PRIMARY KEY,
  avg_medicare_patients INTEGER,
  avg_revenue_per_patient DECIMAL(8,2),
  ccm_adoption_rate DECIMAL(5,2),
  rpm_adoption_rate DECIMAL(5,2),
  bhi_adoption_rate DECIMAL(5,2),
  awv_adoption_rate DECIMAL(5,2),
  pct_99213 DECIMAL(5,2),
  pct_99214 DECIMAL(5,2),
  pct_99215 DECIMAL(5,2),
  avg_chronic_conditions DECIMAL(4,2),
  avg_hcc_risk_score DECIMAL(4,2),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: scan_results (for analytics + email capture)
```sql
CREATE TABLE scan_results (
  id SERIAL PRIMARY KEY,
  npi VARCHAR(10),
  email VARCHAR(255),
  total_missed_revenue DECIMAL(12,2),
  coding_gap DECIMAL(12,2),
  ccm_gap DECIMAL(12,2),
  rpm_gap DECIMAL(12,2),
  bhi_gap DECIMAL(12,2),
  awv_gap DECIMAL(12,2),
  scanned_at TIMESTAMP DEFAULT NOW()
);
```

---

## CMS Data Processing Pipeline

### Step 1: Download
Download from data.cms.gov:
- "Medicare Physician & Other Practitioners - by Provider and Service" (main dataset)
- "Medicare Physician & Other Practitioners - by Provider" (provider-level summary)

### Step 2: Process
Python or Node.js script that:
1. Reads the tab-delimited file (streaming, not all in memory — it's 2GB+)
2. Filters to relevant columns
3. Aggregates provider-level stats into cms_providers table
4. Loads service-level data into cms_provider_services table
5. Calculates specialty benchmarks into specialty_benchmarks table

### Step 3: Benchmark Calculation
For each specialty, calculate:
- Median and percentile values for key metrics
- E&M code distribution (what % of visits are 99213 vs 99214 vs 99215)
- Program adoption rates (what % of providers bill CCM/RPM/BHI/AWV codes)
- Patient panel characteristics (avg chronic condition rates)

---

## SEO Pages Structure

### Programmatic Pages (auto-generated from data)
- `/reports/{state}-medical-practice-revenue` — 50 state pages
- `/reports/{metro}-{specialty}-revenue` — 2,000 metro × specialty pages
- `/specialties/{specialty}-missed-revenue-analysis` — 20+ specialty pages
- `/codes/{cpt-code}-medicare-payment-rate` — 200 CPT code pages

### Manual Content Pages
- `/guides/how-to-bill-99490` — CCM billing guide
- `/guides/99213-vs-99214` — E&M coding comparison
- `/guides/new-rpm-codes-2026` — New codes explainer
- `/guides/medical-practice-revenue-optimization` — Pillar page
- `/compare/chartspan-alternative` — Competitor pages
- `/compare/best-ccm-software-2026` — Comparison roundup

### Every page includes:
- FAQ schema markup (3-5 questions)
- Internal links to scanner + pillar pages
- Meta title, description, OG tags
- CTA to scan NPI

---

## Environment Variables (.env.local)
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=https://npixray.com
```
