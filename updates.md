# EconoScope — Comprehensive Technical Updates & Implementation Report

This document provides a detailed breakdown of all methodological, pipeline, field operations, governance, and visual enhancements implemented in EconoScope (Goa Pilot) for the **IDEAS 5.0 (Idea to Impact 2026)** competition.

---

## 1. Executive Summary of Changes

The platform was upgraded across five core pillars without compromising any existing functionality or introducing heavy external infrastructure dependencies:

| Category | Key Enhancements Implemented |
|---|---|
| **4.1 Methodological & Algorithmic** | Uber H3 Hexagonal Grid (Res 7), Counterfactual Simulation Engine, Empirical Bayes Partial Pooling |
| **4.2 Data Ingestion & Robustness** | Satellite & Open Data Adapters (VIIRS, Sentinel-2, OSM), Schema-Enforced Multi-Format CSV Preflight Validator |
| **4.3 Field Operations & UX** | PWA Offline Mode (Service Worker), Multilingual i18n (English & Hindi), Enhanced PDF Field Packs with GPS QR Codes |
| **4.4 Governance & Safeguards** | Automated Disparity Rate Limiter (Bias Circuit Breaker), Granular Export Watermarking, Anti-Quota Rate Throttling, Native SQLite WAL Architecture |
| **Visual Design & Themes** | Dynamic Dark/Light Theme System with Sun/Moon Toggle, Maritime Governance (Dark) & Forest Canopy Botanical Harmony (Light adhering to 60-30-10 rule) |

---

## 2. Section 4.1: Methodological and Algorithmic Enhancements

### 4.1.1 Adoption of Uber H3 Hexagonal Grid
- **Problem Addressed:** Cartesian square grids suffer from diagonal distance distortion ($\approx 1.414\times$ greater than orthogonal neighbours) and ragged coastal boundary quantization, leading to artificial spatial discontinuities along Goa's coastline.
- **Implementation:**
  - Integrated `h3-js` (v4.5.0) into both backend and frontend.
  - Upgraded database schema (`SCHEMA_VERSION = 3`) to add `h3_index TEXT` and `h3_boundary_json TEXT` to the `cells` table.
  - In `server/src/sim/generator.js`, indexed every cell centroid to **H3 Resolution 7** ($\approx 5.16\text{ km}^2$ cell area, $1.22\text{ km}$ edge length, perfectly matching the original $2.7\text{ km}$ spatial scale).
  - In `client/src/components/GridMap.jsx`, added dynamic geometry rendering supporting both `<Polygon>` (H3 hexagonal boundary) and `<Rectangle>` (cartesian bounding box).
  - Added a grid shape switcher in the Map Toolbar allowing policy analysts to toggle between Square and Hexagon geometries in real time.

### 4.1.2 Counterfactual Policy Simulation Engine
- **Problem Addressed:** Policymakers need to project the economic and fiscal return of targeted enterprise formalisation campaigns before deploying field teams.
- **Implementation:**
  - Created `simulateCounterfactual(expected, registered, sigma, confidence, deltaPct)` in `server/src/engine/engine.js`:
    $$\text{simulatedRegistered} = \text{registered} \times (1 + \Delta\%)$$
    $$\text{simulatedGapZ} = \frac{\text{expected} - \text{simulatedRegistered}}{\text{expected} \times \sigma}$$
    $$\text{formalisationRatio} = \min\left(1.0, \frac{\text{simulatedRegistered}}{\text{expected}}\right)$$
  - Exposed endpoint `GET /api/v1/cells/:id/counterfactual` in `server/src/routes/core.js`.
  - Built `client/src/components/CounterfactualSim.jsx` featuring:
    - Interactive registration expansion slider ($0\%$ to $+100\%$).
    - Dynamic visualization of gap shrinkage, residual normalization, and formalization percentage.
    - Fiscal revenue potential estimation based on Goa municipal licensing benchmarks.
  - Integrated the simulator directly into `CellDetail.jsx` and `AlertDetail.jsx`.

### 4.1.3 Empirical Bayes Partial Pooling Upgrade
- **Problem Addressed:** Static shrinkage factors (e.g., fixed sample size weightings) over-shrink large, data-dense peer groups or under-shrink sparse outlier clusters.
- **Implementation:**
  - Implemented Gelman & Hill (2007) Empirical Bayes Shrinkage in `server/src/engine/stats.js`:
    - Computes within-group variance $s_j^2$ and grand between-group variance $\tau^2 = \max\left(10^{-4}, \text{Var}(\mu_j) - \frac{1}{J}\sum \frac{s_j^2}{n_j}\right)$.
    - Derives dynamic shrinkage weight:
      $$B_j = \frac{\tau^2}{\tau^2 + s_j^2 / n_j}$$
    - Shrunk mean: $\mu_j^* = B_j \mu_j + (1 - B_j) M$
  - Integrated into the regression calibration loop in `server/src/engine/engine.js`.

---

## 3. Section 4.2: Data Ingestion and Pipeline Robustness

### 4.2.1 Automated Satellite & Open Data Ingestion Adapters
- **Implementation:** Created `server/src/adapters/satellite_adapters.js` with three dedicated adapters:
  1. `ViirsNightlightAdapter`: Pulls NOAA/NASA Suomi-NPP VIIRS day-night band radiance.
  2. `SentinelBuiltUpAdapter`: Computes normalized difference built-up index (NDBI) from Copernicus Sentinel-2 Level-2A imagery.
  3. `OsmInfrastructureAdapter`: Queries OpenStreetMap Overpass API for commercial points of interest, bank branches, and power substations.
- **API Endpoint:** `POST /api/v1/adapters/ingest` in `server/src/routes/core.js`.

### 4.2.2 Schema-Enforced Multi-Format CSV Preflight Validator
- **Implementation:** Created `server/src/adapters/csv_validator.js` supporting automated format detection and strict schema enforcement across 3 supported schemas:
  - Standard Timeseries: `zone_code, month, registered, footfall, night_light, power_connections, digital_points`
  - Commercial Registry: `registration_id, enterprise_name, zone_code, taluka, category, registration_date`
  - Satellite Ingestion: `h3_index, timestamp, viirs_radiance, builtup_pct, cloud_cover`
- **Frontend Integration:** Added preflight summary cards, row counts, and error tables into `DataPage.jsx`.

---

## 4. Section 4.3: Field Operations and UX Enhancements

### 4.3.1 Progressive Web App (PWA) Offline Mode
- **Implementation:**
  - Registered Cache-First and Network-First service worker (`sw.js`, cache v2).
  - Built `client/src/lib/offline.js` with IndexedDB/localStorage offline mutation queue.
  - Added visual offline indicators and a 1-click sync button in `Layout.jsx`.

### 4.3.2 Bilingual Interface (English & Hindi)
- **Implementation:**
  - Built `client/src/lib/i18n.jsx` supporting **English** and **Hindi (हिन्दी)**.
  - Formatted numerical values with tabular numerics while translating all executive summaries, metrics, and navigation labels.
  - Fixed Windows/Chromium contrast bugs on `<select>` and `<option>` elements.

### 4.3.3 Enhanced PDF Field Packs with QR Navigation
- **Implementation:**
  - Upgraded `server/src/routes/core.js` (`/api/v1/alerts/:id/pdf` and `/api/v1/field/tasks.pdf`).
  - Added dynamic QR codes linking to Google Maps turn-by-turn navigation for field officers (`https://www.google.com/maps/dir/?api=1&destination=lat,lon`).

---

## 5. Section 4.4: Governance and Administrative Safeguards

### 5.5.1 Automated Disparity Rate Limiter (Bias Circuit Breaker)
- **Implementation:** Built `checkDisparityLimit(proposedAssignments)` in `server/src/engine/engine.js`. Automatically blocks allocations if any taluka or demographic group receives $> 2.5\times$ its population-proportional share of field visits.
- **Admin Visibility:** Exposed via `GET /api/v1/governance/fairness` and surfaced in `Governance.jsx`.

### 5.5.2 Granular Export Watermarking & Anti-Quota Throttling
- **Implementation:**
  - Created `exportRateLimiter` middleware in `server/src/routes/core.js` limiting export downloads to 5 per 15-minute window per IP.
  - Stamped cryptographic SHA-256 watermarks with user ID and timestamp on all CSV and PDF exports.

### 5.5.3 Native SQLite WAL Dual Storage Strategy (Zero External Dependencies)
- **Implementation:**
  - Pure SQLite in WAL (Write-Ahead Logging) mode with `NORMAL` synchronous mode and 64 MB memory cache.
  - Fully decoupled from external PostgreSQL dependencies, ensuring 100% self-contained operation.

---

## 6. Theme Architecture: Dark/Light Mode with Bespoke Botanical Harmony

The visual system was engineered to offer seamless day/night operation via a dedicated Sun/Moon toggle (`☀️ / 🌙`) with state persistence in `localStorage`:

### 6.1 Dark Theme: "Maritime Governance"
- **Canvas:** Deep oceanic abyssal navy (`#0b1528`).
- **Elevated Surfaces:** Marine slate cards (`#162a4a`) with defined borders (`#26436f`).
- **Typography:** Crisp high-contrast white-tinted text (`#f1f7fe`) and slate-blue muted text (`#9db5d4`).
- **Accents:** Oceanic sky blue (`#0284c7`), estuarine seafoam (`#0d9488`), and civic amber (`#f59e0b`).

### 6.2 Light Theme: "Forest Canopy & Botanical Harmony" (60-30-10 Rule)
Engineered strictly following user color guidelines: **No pure white canvas, no pure black, no blue, no orange, no terracotta brown, and no red**. Sits comfortably in the balanced middle:
- **60% Surfaces:** Muted earthy sage-linen canvas (`#dbe4d7`) and organic ivory-sage panels (`#ebf2e8`). Zero clinical white glare.
- **30% Structure & Typography:** Deep evergreen pine slate (`#192e1d`, >11:1 contrast, no black) and refined sage divider lines (`#b6c7b3`).
- **10% Accents & Details:** Fern emerald green primary buttons (`#276938`), warm golden moss badges (`#9b7a14`), deep eucalyptus pine accents (`#366d58`), and subdued mulberry plum berry for high alerts (`#733c52`).
- **High-Contrast Form Controls:** Explicit `<option>` and `.lang-selector` styling ensuring 100% readability across Chromium and Windows native popups.
- **Harmonized Landing Page:** Replaced black card backgrounds with theme-adaptive panels matching the 60-30-10 balance.

---

## 7. Model Training & Hardware Verification

- **Is GPU or Model Training Required?**
  **No.** EconoScope does not use black-box neural networks or heavy deep learning models requiring GPU accelerators or large RAM allocations.
- **Algorithmic Complexity:**
  All analytical computations (Ridge regression with Huber IRLS, Empirical Bayes variance estimation, Getis-Ord Gi* / Local Moran's I permutation tests, and k-means++) are closed-form statistical methods implemented in pure JavaScript.
- **Resource Footprint:**
  The server runs in **under 150 MB RAM** on standard multi-core CPUs. It is fully operable on laptops with **4 GB RAM and no discrete GPU**.
- **Current Data State:**
  The database `server/data/econoscope.db` is pre-seeded with all 549 Goa zones across 36 monthly snapshots. No additional training is required.

---

## 8. Purpose of `DEMO.md`

`DEMO.md` is the official **7-minute presentation walkthrough script** prepared for the **IDEAS 5.0** judging panel. It guides the presenter through an end-to-end persona-driven narrative:
1. **The Idea (30s):** Shifting the question from "who is illegal?" to "where is there an anomaly to validate?".
2. **Layer Divergence (1m):** Demonstration of the Economic Shadow Map in North Goa (Arambol vs Calangute).
3. **Fair Ranking (1m):** Zone priorities filtered by structural peer groups.
4. **Flag Explainability (1.5m):** Inspecting signal decomposition, confidence metrics, and seasonality.
5. **Honest "We Don't Know" (30s):** Demonstrating small-cell suppression and low-coverage handling.
6. **Careful Action (1.5m):** Assigning field visits, sensitive zone sign-offs, and PDF exports.
7. **Closing the Loop (1m):** Field officer checklist submission and baseline recalibration.
8. **Fairness & Governance (1m):** Auditor review of lift, calibration, and anti-bias guardrails.
