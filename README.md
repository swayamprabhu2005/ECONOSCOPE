# EconoScope — Geospatial Economic Intelligence Platform (Goa Pilot)

[![Engine Tests](https://img.shields.io/badge/Tests-11%20Passed-10b981.svg)]()
[![Platform](https://img.shields.io/badge/Node.js-22.5%2B%20(Native%20SQLite%20WAL)-0284c7.svg)]()
[![Spatial Engine](https://img.shields.io/badge/Grid-Uber%20H3%20Hexagonal%20Res%207-0d9488.svg)]()
[![Themes](https://img.shields.io/badge/Themes-Maritime%20Dark%20%7C%20Forest%20Sage%20Light-f59e0b.svg)]()
[![Offline Mode](https://img.shields.io/badge/PWA-Service%20Worker%20Active-818cf8.svg)]()
[![Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Hindi%20(हिन्दी)-276938.svg)]()

> **Core Philosophy:** *A flag is a zone-level anomaly to validate, never an accusation against a business or individual. EconoScope shifts state capacity from arbitrary punitive raids to evidence-backed enterprise formalisation, spatial fairness, and trade facilitation.*

Developed by **Team Chakravyuh** for **IDEAS 5.0 (Idea to Impact 2026)** at Padre Conceição College of Engineering (PCCE), Goa.

---

## 1. What EconoScope Is & Why It Is Required

Regional economies across Goa and India's coastal belts experience fast-moving commercial shifts that static decennial census records and annual tax registers fail to capture:
- **Coastal Tourism Corridors:** Areas such as Arambol, Morjim, and Calangute see massive seasonal surges in hospitality, rentals, and retail that diverge from formal registrations.
- **Fast-Growing Infrastructure Hubs:** The commissioning of Manohar International Airport at Mopa and expanding logistics corridors stimulate rapid commercial activity ahead of formal licensing enumeration.
- **Economic Transition Zones:** Mining belt transitions in Sanguem and Quepem lead to localized economic contraction that historical records miss.

### The Problem with Traditional Enforcement
- **Blanket Door-to-Door Surveys:** Cost tens of lakhs, take months to complete, and become obsolete before policy reports are published.
- **Punitive Enforcement Raids:** Generate harassment, disproportionately impact vulnerable micro-enterprises, and produce adversarial friction between citizens and local government.

### The EconoScope Solution
**EconoScope** partitions Goa into **549 spatial zones** (modeled as both Uber H3 Hexagons and Cartesian grids) and fuses multimodal independent signals against official business registers:
1. **NOAA/NASA VIIRS Night-Time Lights** (proxy for electrified commercial activity)
2. **Copernicus Sentinel-2 Built-Up Footprint** (physical infrastructure growth)
3. **OpenStreetMap Commercial Infrastructure** (banks, substations, logistics points)
4. **Tourism Footfall & Directory Density** (independent footfall and listings)
5. **Commercial Power & Digital Transaction Density** (economic velocity)

By comparing each zone **only against structurally similar peers** (via unsupervised peer grouping) and applying **Empirical Bayes partial pooling**, EconoScope isolates real registration gaps while rigorously accounting for natural commercial variance, seasonality, and data sparsity.

---

## 2. Comprehensive Platform Enhancements

### 2.1 Methodological & Algorithmic Enhancements
- **Uber H3 Hexagonal Grid (Resolution 7):** Integrated discrete global grid system (`h3-js` v4.5.0). Hexagons eliminate diagonal distance distortion (all 6 neighbours equidistant at 1.22 km edge length, ~5.16 km² area) and resolve coastal boundary quantization errors. The map interface features an instant toggle between Hexagonal and Square views.
- **Counterfactual Policy Simulation Engine:** Interactive policy projection tool on every zone evidence card. Policymakers can adjust a simulated registration growth slider ($0\%$ to $+100\%$) to project residual gap normalization, estimated formalization ratio, and expected local municipal revenue yield.
- **Empirical Bayes Partial Pooling:** Replaced static shrinkage with Gelman & Hill (2007) Empirical Bayes variance shrinkage ($\lambda_j = \tau^2 / (\tau^2 + s_j^2 / n_j)$). Zones in smaller or noisier peer groups are gracefully shrunk toward the state prior, preventing false-positive spikes in sparse clusters.

### 2.2 Data Ingestion & Pipeline Robustness
- **Automated Satellite & Open Data Adapters:** Modular ingestion adapters for NOAA VIIRS Black Marble radiance, Sentinel-2 NDBI built-up indices, and OpenStreetMap Overpass amenities.
- **Schema-Enforced Multi-Format CSV Preflight Validator:** Pre-upload inspector supporting standard time-series, commercial registries, and satellite imagery feeds with automated column detection, type verification, and interactive error tables.

### 2.3 Field Operations & UX Enhancements
- **Progressive Web App (PWA) Offline Mode:** Equipped with Service Worker caching (`sw.js`, cache v2), web app manifest, and local IndexedDB/localStorage mutation queues. Field teams in remote hinterlands (e.g., Netravali, Cotigao) can record validations offline; actions automatically sync upon reconnecting.
- **High-Contrast Bilingual Interface (English & Hindi):** End-to-end interface translation for **English** and **Hindi (हिन्दी)** across navigation, KPI metrics, priority queues, and field forms. Explicit contrast rules eliminate browser dropdown visibility issues on Windows and Chromium.
- **Enhanced PDF Field Packs with GPS QR Codes:** Exportable field packs include dynamic QR codes that open smartphone turn-by-turn navigation directly to zone coordinates, alongside structured verification checklists and senior sign-off blocks for sensitive zones.

### 2.4 Governance & Administrative Safeguards
- **Automated Disparity Rate Limiter (Bias Circuit Breaker):** Continuous algorithmic monitor that prevents demographic or geographic over-policing by capping any taluka’s field visit allocation at $\le 2.5\times$ its population share.
- **Granular Export Watermarking & Anti-Quota Throttling:** Cryptographic SHA-256 watermarks embedded in all exports, with strict rate limiting (5 downloads per 15-minute window) to prevent validation lists from becoming punitive quotas.
- **Zero External Database Overhead (Native SQLite WAL):** Built entirely on Node.js 22 built-in `node:sqlite` with Write-Ahead Logging (WAL) concurrency and 64 MB memory cache. **No PostgreSQL, Redis, or external database services required.**

### 2.5 Dual-Theme Visual System (Sun/Moon Toggle)
- **Sun / Moon Toggle (`☀️ / 🌙`):** Accessible in the top navigation bar of both the public landing page and the administrative portal, with state persisted in `localStorage`.
- **Dark Theme ("Maritime Governance"):** Deep abyssal navy canvas (`#0b1528`), marine slate cards (`#162a4a`), defined borders (`#26436f`), and oceanic accents.
- **Light Theme ("Forest Canopy & Botanical Harmony" — 60-30-10 Rule):**
  - **Strict Color Compliance:** NO stark white canvas, NO pure black text, NO blue, NO orange, NO terracotta brown, and NO red.
  - **60% Surfaces:** Muted earthy sage-linen canvas (`#dbe4d7`) and organic ivory-sage panels (`#ebf2e8`).
  - **30% Structure & Text:** Deep evergreen pine slate typography (`#192e1d`, >11:1 AAA contrast) and soft sage borders (`#b6c7b3`).
  - **10% Accents:** Fern emerald green primary buttons (`#276938`), warm golden moss badges (`#9b7a14`), deep eucalyptus pine (`#366d58`), and royal mulberry plum berry (`#733c52`).
  - **Component Harmony:** "How it works" cards, metric boxes, data tables, and Recharts SVG charts blend cohesively with the active background.

---

## 3. Quick Start Guide

### System Requirements
- **Node.js:** Version **22.5 or higher** (required for native `node:sqlite` engine).
- **Hardware:** Runs smoothly on **4 GB RAM laptops with no discrete GPU** (server RAM footprint is under 150 MB).
- **Database:** Zero setup needed — pre-seeded SQLite database with 549 zones and 36 months of data.

### One-Click Launch (Windows)
Double-click `run.bat` or run from PowerShell / Command Prompt:
```cmd
run.bat
```
`run.bat` checks Node.js, installs dependencies if needed, ensures the demo database is seeded, and launches both the backend API and frontend portal concurrently.

### Manual Launch
```bash
# 1. Install dependencies
npm run setup

# 2. Run backend API (:4000) and frontend Vite dev server (:5173)
npm run dev
```

Open **http://localhost:5173** in your web browser.

### Running Engine Verification Tests
To run the full suite of 11 algorithmic, statistical, and storage tests:
```bash
node --disable-warning=ExperimentalWarning --test server/test/engine.test.mjs
```

---

## 4. Demo Accounts & Credentials

The platform includes five pre-configured role-based accounts:

| Role | Email | Password | Scope of Authority |
|---|---|---|---|
| **Administrator** | `admin@econoscope.in` | `admin123` | Full administrative control, storage telemetry, user creation, sensitive zone sign-offs |
| **Policy Analyst** | `analyst@econoscope.in` | `analyst123` | Priority ranking, field assignment, counterfactual simulations, CSV/PDF field pack export |
| **Field Officer (North)** | `field.north@econoscope.in` | `field123` | North Goa assigned visits, PWA offline inspection checklist, ground outcome submission |
| **Field Officer (South)** | `field.south@econoscope.in` | `field123` | South Goa assigned visits, PWA offline inspection checklist, ground outcome submission |
| **Formalisation Lead** | `planner@econoscope.in` | `planner123` | Read-only portal view, counterfactual modeling, enterprise outreach referrals |
| **Auditor / Governance** | `auditor@econoscope.in` | `auditor123` | Read-only audit log, bias circuit breaker telemetry, statistical lift & calibration review |

---

## 5. Competition Resources

- **Presentation Walkthrough:** See [DEMO.md](DEMO.md) for the complete 7-minute judged presentation narrative.
- **Detailed Technical Changelog:** See [updates.md](updates.md) for in-depth documentation of all mathematical formulas, schema enhancements, and design tokens.
