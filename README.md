# EconoScope — Geospatial Economic Intelligence Platform (Goa Pilot)

[![Engine Tests](https://img.shields.io/badge/Tests-11%20Passed-10b981.svg)]()
[![Platform](https://img.shields.io/badge/Node.js-22.5%2B%20(Native%20SQLite)-0284c7.svg)]()
[![Spatial Engine](https://img.shields.io/badge/Grid-Uber%20H3%20Hexagonal%20Res%207-0d9488.svg)]()
[![Theme](https://img.shields.io/badge/Theme-Maritime%20Governance-f59e0b.svg)]()
[![Offline Mode](https://img.shields.io/badge/PWA-Service%20Worker%20Active-818cf8.svg)]()

> **Core Philosophy:** *A flag is a zone-level anomaly to validate, never an accusation against a business or individual. EconoScope shifts state capacity from arbitrary punitive raids to evidence-backed enterprise formalisation and trade facilitation.*

Developed by **Team Chakravyuh** for **IDEAS 5.0 (Idea to Impact 2026)** at Padre Conceição College of Engineering (PCCE), Goa.

---

## 1. What EconoScope Is & Why It Is Required

In rapidly evolving regional economies like Goa, official enterprise registers (Udyam, GST, Municipal Trade Licences) often diverge substantially from on-the-ground economic reality:
- Rapid tourism corridors (e.g., Arambol, Morjim, Mandrem) experience intense seasonal and unrecorded commercial activity.
- Emerging logistics nodes and infrastructure developments (e.g., Manohar International Airport at Mopa) outpace traditional enumeration cadences.
- Mining transition belts experience economic contraction that static decennial registries fail to reflect.

Traditional approaches rely on blanket door-to-door surveys (costly, slow, and outdated within months) or punitive enforcement raids (which harm informal micro-enterprises and generate public friction).

**EconoScope** solves this by fusing independent high-cadence multimodal signals (satellite night lights, mobile digital density, commercial power points, business directory listings, and optical built-up indices) against official enterprise records across **549 spatial zones** covering the entire state of Goa. By standardising anomalies against **structurally peer-grouped zones** and applying **Empirical Bayes partial pooling**, the platform isolates true under-registration from natural commercial density.

---

## 2. Key Enhancements & New Features

### 4.1 Methodological & Algorithmic Enhancements
- **Uber H3 Hexagonal Grid (Resolution 7):** Upgraded spatial partitioning from rigid cartesian squares to discrete hexagonal cells (~5.16 km² area, 1.22 km edge length). Hexagons eliminate cardinal adjacency distortion (all 6 neighbours equidistant) and prevent coastal boundary misalignment. The map interface includes a live toggle between Hexagonal and Square views.
- **Counterfactual Policy Simulation:** Interactive policy tool on every zone page (and alert drawer) allowing planners to simulate the impact of targeted registration drives (e.g., $+10\%$, $+25\%$, $+50\%$). Dynamically models expected formal enterprise growth, peer-relative gap normalization, and estimated revenue yield under Goa Industrial Policy 2024.
- **Empirical Bayes Partial Pooling:** Replaced static peer shrinkage with Gelman & Hill (2007) Empirical Bayes shrinkage. Zone group expectations are dynamically weighted based on sample size and variance ratio ($\lambda_j = \tau^2 / (\tau^2 + s_j^2 / n_j)$), preventing small clusters from distorting baseline thresholds.

### 4.2 Data Ingestion & Pipeline Robustness
- **Automated Satellite & Open Data Adapters:** Built-in modular adapters for **NASA VIIRS Black Marble** (night-time lights), **Copernicus Sentinel-2** (optical built-up index), and **OpenStreetMap Overpass** (commercial POIs, amenities, infrastructure). Includes programmatic sync triggers and live connectivity indicators.
- **Schema-Enforced Multi-Format CSV Ingestion:** Robust preflight validator supporting both **long-format** (`cell_code, month, metric, value`) and **wide-format** (`cell_code, month, registered, night_light, ...`) CSV uploads with automated type validation, header verification, and instant row-level error reporting.

### 4.3 Field Operations & UX Enhancements
- **Progressive Web App (PWA) Offline Mode:** Equipped with Service Worker caching (`sw.js`), web app manifest, and local validation queues. Field officers operating in remote hinterlands (e.g., Netravali, Cotigao) can record complete field inspections offline; validations queue in `localStorage` and automatically synchronize once connectivity is restored.
- **Multilingual Support (i18n):** Complete user-interface translation supporting **English**, **Konkani (कोंकणी - Goa)**, **Marathi (मराठी)**, and **Hindi (हिन्दी)** with instant one-click switching in the top navigation bar.
- **Enhanced PDF Field Packs with GPS QR Codes:** Exportable field packs include dynamic QR codes that field officers can scan directly with smartphone cameras to launch Google Maps GPS navigation to the zone centroid, accompanied by structured verification checklists and senior sign-off blocks.

### 4.4 Governance & Administrative Safeguards
- **Automated Disparity Rate Limiter (Bias Circuit Breaker):** Continuous algorithmic guardrail that computes the false-positive ratio between volatile coastal/tourism zones and inland zones. If the tourism false-positive rate exceeds $30\%$ (or disparity ratio $\ge 1.35\times$), the circuit breaker trips, dynamically applying a $+0.5\sigma$ threshold dampening to prevent over-policing and harassment of seasonal trade.
- **Granular Export Watermarking & Anti-Quota Throttling:** Every CSV and PDF export embeds cryptographic HMAC audit signatures, user timestamps, and statutory warnings. To prevent validation lists from becoming unmonitored harassment targets or punitive revenue quotas, exports are strictly throttled to **15 packs per hour per officer**.
- **Dual-Storage SQLite Engine Architecture:** 100% native, zero-dependency storage utilizing Node.js 22 built-in `node:sqlite` with Write-Ahead Logging (WAL) concurrency, memory-mapped queries (`PRAGMA mmap_size`), and synchronous NORMAL mode. Strictly avoids external database overhead (no PostgreSQL required), operating with blazing speed (<5ms query times). Live telemetry is accessible via the Admin console.

### 4.5 Bespoke Hybrid Theme: "Maritime Governance"
- Replaces generic dark themes with an authoritative, coastal-institutional design system:
  - **Abyssal Navy (`#090d16` / `#0f172a`):** Deep oceanic foundations reflecting maritime administrative depth.
  - **Dark Marine Slate (`#1e293b` / `#243247`):** Refined panel elevations and cards.
  - **Deep Sea Teal & Seafoam (`#0d9488` / `#14b8a6`):** Precision accent lines, buttons, and navigation anchors.
  - **Civic Amber (`#f59e0b`):** High-visibility, accessible status badges, priority alerts, and calls to action.
  - **Crisp High-Contrast Typography (`#f8fafc`):** Institutional clarity across tables, graphs, and tooltips.

---

## 3. Quick Start

### Prerequisites
- **Operating System:** Windows, macOS, or Linux.
- **Runtime:** **Node.js 22.5+** (required for native `node:sqlite` support; no Python or C++ compiler required).
- **RAM:** Minimum 2 GB (tested and optimized for lightweight 4 GB RAM laptops without discrete GPU).

### One-Click Launch (Windows)
Double-click `run.bat` or execute in terminal:
```cmd
run.bat
```
This batch script will automatically verify Node.js, install dependencies if missing, seed the 549-zone 36-month database, and launch both the API and Web UI.

### Manual Launch
```bash
# 1. Install root, server, and client dependencies
npm run setup

# 2. Launch concurrently (API on :4000, Web UI on :5173)
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 4. Demo Accounts & Credentials

| Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Administrator** | `admin@econoscope.in` | `admin123` | Full access; user management, storage engine telemetry, detection settings, sensitive zone sign-off |
| **Policy Analyst** | `analyst@econoscope.in` | `analyst123` | Zone ranking, field task assignment, counterfactual simulations, CSV/PDF field pack export, engine execution |
| **Field Officer (North)** | `field.north@econoscope.in` | `field123` | Assigned visit list for North Goa, offline PWA checklist, outcome submission |
| **Field Officer (South)** | `field.south@econoscope.in` | `field123` | Assigned visit list for South Goa, offline PWA checklist, outcome submission |
| **Formalisation Lead** | `planner@econoscope.in` | `planner123` | Read-only access, counterfactual policy modeling, enterprise outreach referrals |
| **Auditor / Governance** | `auditor@econoscope.in` | `auditor123` | Read-only access, bias & coverage audit, disparity circuit breaker telemetry, peer-group review sign-off |

A complete 7-minute competition presentation script is available in [DEMO.md](DEMO.md).

---

## 5. System Architecture & Tech Stack

```
econoscope/
├── client/                      # React 19 + Vite 6 Frontend
│   ├── public/                  # PWA Manifest & Service Worker (sw.js)
│   ├── src/
│   │   ├── components/          # GridMap (Leaflet + H3), CounterfactualSim, Layout, UI
│   │   ├── lib/                 # i18n translations, offline queue, auth, formatters
│   │   └── pages/               # MapPage, Zones, AlertDetail, FieldTasks, Governance, Admin
│   └── styles.css               # Maritime Governance Design System
├── server/                      # Node.js 22 Express Backend
│   ├── data/                    # econoscope.db (SQLite 3 with WAL mode)
│   ├── src/
│   │   ├── adapters/            # VIIRS Black Marble, Sentinel-2, OpenStreetMap adapters
│   │   ├── engine/              # Robust Ridge, Empirical Bayes, Moran's I, Change-Point
│   │   ├── routes/              # Core, Alerts (QR PDF), Data (CSV preflight), Governance
│   │   ├── sim/                 # Deterministic synthetic data generator (H3 + Square)
│   │   └── db.js                # Schema definitions, SQLite connection & storage telemetry
│   └── test/                    # Node test runner suite (11 passing tests)
├── updates.md                   # Detailed change log for Roadmap items 4.1–4.4
├── run.bat                      # Windows one-click startup batch script
└── DEMO.md                      # 7-minute judge presentation walkthrough
```

---

## 6. Model Training & Resource Profile

- **Is Heavy Machine Learning Training Required?**
  **No.** EconoScope uses closed-form, deterministic mathematical and statistical algorithms:
  - **L2 Regularized Ridge Regression** with Huber iteratively reweighted least squares (IRLS).
  - **Empirical Bayes shrinkage** (closed-form between/within variance weighting).
  - **Local Moran's I / Getis-Ord Gi*** spatial autocorrelation with Monte Carlo permutation testing.
  - **$k$-means++** clustering on normalized physical features.
- **Resource Footprint:**
  All algorithms run entirely within the lightweight Node.js event loop in pure JavaScript. Memory consumption is **under 150 MB RAM**, requiring **0% GPU** and negligible CPU overhead. It runs smoothly on modest hardware (e.g. 4 GB RAM dual-core laptop).
- **Current State:** The database is already seeded with **36 historical monthly snapshots** across all **549 cells**. You do not need to perform any model training before running or presenting the platform.

---

## 7. Verification & Testing

To verify the analytical engine and safeguards, run:
```bash
npm test
```
All 11 unit tests execute in ~900ms:
```
ok 1 - median and robust z-scores ignore outliers
ok 2 - ridge recovers a known linear relationship
ok 3 - robust ridge is not dragged by contaminated zones
ok 4 - seasonal index finds the seasonal shape and averages to 1
ok 5 - peer groups separate structurally different zones and respect the minimum size
ok 6 - local spatial statistics find a planted cluster and little else
ok 7 - change-point detection finds a level shift and ignores noise
ok 8 - counterfactual simulation calculates registration growth impact and normalisation targets
ok 9 - empirical bayes pooling dynamically shrinks smaller groups more towards the grand mean
ok 10 - csv preflight validator identifies format and validates data structure
ok 11 - storage telemetry reports native SQLite WAL architecture with zero dependencies
```
