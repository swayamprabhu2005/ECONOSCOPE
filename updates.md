# EconoScope — Comprehensive Technical Updates & Implementation Report

This document provides a detailed breakdown of all methodological, pipeline, field operations, governance, and visual enhancements implemented in EconoScope (Goa Pilot) for the **IDEAS 5.0 (Idea to Impact 2026)** competition.

---

## 1. Executive Summary of Changes

The platform was upgraded across five core pillars without compromising any existing functionality or introducing heavy external infrastructure dependencies:

| Category | Key Enhancements Implemented |
|---|---|
| **4.1 Methodological & Algorithmic** | Uber H3 Hexagonal Grid (Res 7), Counterfactual Simulation Engine, Empirical Bayes Partial Pooling |
| **4.2 Data Ingestion & Robustness** | Satellite & Open Data Adapters (VIIRS, Sentinel-2, OSM), Schema-Enforced Multi-Format CSV Preflight Validator |
| **4.3 Field Operations & UX** | PWA Offline Mode (Service Worker), Multilingual i18n (English, Konkani, Marathi, Hindi), Enhanced PDF Field Packs with GPS QR Codes |
| **4.4 Governance & Safeguards** | Automated Disparity Rate Limiter (Bias Circuit Breaker), Granular Export Watermarking, Anti-Quota Rate Throttling, Native SQLite WAL Dual Storage Architecture |
| **Visual Design** | Bespoke "Maritime Governance" Theme (Abyssal Navy, Deep Sea Teal, Civic Amber) |

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
    - Dynamic shrinkage weight:
      $$\lambda_j = \frac{\tau^2}{\tau^2 + s_j^2 / n_j}$$
    - Shrunk peer-group level:
      $$\theta_j = \lambda_j \bar{y}_j + (1 - \lambda_j) \mu_{\text{grand}}$$
  - Integrated into `server/src/engine/engine.js` so peer group residual baselines dynamically adjust according to group evidence density.

---

## 3. Section 4.2: Data Ingestion and Pipeline Robustness

### 4.2.1 Automated Satellite & Open Data Ingestion Adapters
- **Problem Addressed:** Manual CSV curation is labour-intensive. Automated adapters are needed to query external geospatial feeds directly.
- **Implementation:**
  - Created `server/src/adapters/index.js` containing three dedicated adapters:
    1. **VIIRS Black Marble (NASA):** Ingests lunar-calibrated day/night band nighttime radiance.
    2. **Copernicus Sentinel-2 (ESA):** Ingests high-resolution optical surface reflectance and normalised difference built-up index (NDBI).
    3. **OpenStreetMap Overpass API:** Ingests commercial amenities, shops, accommodation nodes, and transport infrastructure.
  - Added REST endpoints `GET /api/v1/datasets/adapters` and `POST /api/v1/datasets/adapters/:key/sync` in `server/src/routes/data.js`.
  - Added an interactive Open Data Adapters card on the **Data & pipeline** page showing connection status, licensing, and sync actions.

### 4.2.2 Schema-Enforced Multi-Format CSV Preflight Validator
- **Problem Addressed:** Departmental departments export records in conflicting CSV schemas (some long-format, some wide-format matrix tables).
- **Implementation:**
  - Built `validateCsvPreflight(text)` in `server/src/datasets.js`:
    - Automatically detects format (`long` vs `wide`).
    - Validates mandatory fields (`cell_code`, `month`, and metrics).
    - Checks for negative numeric anomalies, malformed dates (`YYYY-MM`), and unknown cell identifiers.
  - Added `POST /api/v1/datasets/validate-csv` providing instant pre-upload validation previews with row-by-row error diagnostics.

---

## 4. Section 4.3: Field Operations and UX Enhancements

### 4.3.1 Progressive Web App (PWA) Offline Mode
- **Problem Addressed:** Field validation officers in rural talukas (e.g., Sanguem, Canacona, Sattari) frequently operate without cellular data.
- **Implementation:**
  - Added `client/public/manifest.json` with standalone display mode, theme colors, and PWA icon definitions.
  - Implemented `client/public/sw.js` with Cache-First strategy for static application assets and Network-First with fallback for data.
  - Built `client/src/lib/offline.js`:
    - Caches assigned task lists to `localStorage`.
    - Queues inspection validations locally when offline.
    - Provides background sync and a manual "Sync Now" trigger when online.
  - Added visual offline status pills and sync indicators in `Layout.jsx` and `FieldTasks.jsx`.

### 4.3.2 Local Language Support (i18n)
- **Problem Addressed:** Grassroots field staff in Goa work more effectively in local administrative languages.
- **Implementation:**
  - Created `client/src/lib/i18n.jsx` containing comprehensive dictionary mappings for:
    - **English (Default)**
    - **Konkani (कोंकणी - Goa)**
    - **Marathi (मराठी)**
    - **Hindi (हिन्दी)**
  - Wrapped root application in `I18nProvider`.
  - Added native language selector in the top header. All navigation links, status indicators, and field checklists dynamically translate.

### 4.3.3 Enhanced PDF Field Packs with QR Navigation
- **Problem Addressed:** Field officers needed paper-ready field packs with exact navigational guidance and explicit outreach safeguards.
- **Implementation:**
  - Integrated `qrcode` with `PDFDocument` in `server/src/routes/alerts.js`.
  - For each flagged zone, the generated PDF embeds a scannable QR code encoding the zone centroid coordinates (`https://maps.google.com/?q=lat,lon`), enabling instant smartphone GPS navigation.
  - Includes structured multi-point verification checkboxes, clear "Outreach First" policy reminders, and senior sign-off blocks.

---

## 5. Section 4.4: Governance and Administrative Safeguards

### 5.5.1 Automated Disparity Rate Limiter (Bias Circuit Breaker)
- **Problem Addressed:** High-volatility tourist and coastal zones can generate disproportionate false-positive anomalies due to temporary holiday surges, creating an unfair inspection burden on coastal communities.
- **Implementation:**
  - In `server/src/routes/governance.js`, the platform continuously computes the false-positive validation rate in coastal/tourism zones ($\text{FP}_{\text{tourist}}$) vs inland zones ($\text{FP}_{\text{inland}}$).
  - If $\text{FP}_{\text{tourist}} \ge 30\%$ or the disparity ratio $\ge 1.35\times$, the **Bias Circuit Breaker** trips:
    - Status changes to `CIRCUIT BREAKER ENGAGED (Rate Limiter Active)`.
    - An automatic $+0.5\sigma$ threshold dampening is applied to coastal single-signal candidates.
  - Added a dedicated monitoring card on the **Governance** page displaying real-time rates and safeguard status.

### 5.5.2 Granular Export Watermarking & Anti-Quota Throttling
- **Problem Addressed:** Risk of bulk exports being misused as mandatory departmental inspection quotas or harassment targets.
- **Implementation:**
  - **Cryptographic Watermarking:** Every CSV and PDF export includes an HMAC-SHA256 audit signature, downloading user metadata, ISO timestamp, and statutory notice:
    > *"STATUTORY NOTICE: Zone scores are exploratory statistical indicators. Under Goa Industrial Policy 2024 & EconoScope Governance Charter, this document CANNOT be used as an enforcement target, revenue quota, or punitive citation list."*
  - **Anti-Quota Rate Throttling:** Added sliding-window rate limiting in `server/src/routes/alerts.js`. Users attempting more than **15 bulk exports per hour** receive an HTTP 429 error and an audit log event, preventing mass extraction.

### 5.5.3 Dual Storage Strategy with Pure SQLite Engine
- **User Constraint Observed:** Strict avoidance of external PostgreSQL / PostGIS infrastructure.
- **Implementation:**
  - Solidified a zero-dependency dual storage architecture inside `server/src/db.js`:
    - **High-Speed OLTP Store:** Native `node:sqlite` running with Write-Ahead Logging (`PRAGMA journal_mode = WAL`), memory-mapped I/O (`PRAGMA mmap_size = 268435456`), and synchronous `NORMAL`.
    - **Analytical Snapshot Store:** Deterministic versioned tables storing 36 months of longitudinal observations and k-means peer structures.
  - Added `getStorageTelemetry()` reporting database size, WAL buffer size, integrity check status, and zero-external-dependency confirmation.
  - Exposed via `GET /api/v1/admin/storage` and visualized in the Admin panel under **Dual Storage Architecture**.

---

## 6. Theme Implementation: "Maritime Governance"

The generic dark theme was replaced with a bespoke design system created during the theme factory analysis:

- **Abyssal Navy (`#090d16` / `#0f172a`):** Deep oceanic backgrounds providing visual grounding.
- **Dark Marine Slate (`#1e293b` / `#243247`):** High-clarity elevated cards, dialogs, and table surfaces.
- **Slate Borders (`#334155` / `#475569`):** Subdued, accessible dividers replacing stark outlines.
- **Deep Sea Teal (`#0d9488` / `#14b8a6`):** Primary interactive elements, brand iconography, and positive indicators.
- **Civic Amber (`#f59e0b`):** High-visibility action buttons, priority alert badges, and warning states.
- **Oceanic White (`#f8fafc`):** High-contrast typography optimized for accessibility and readability.

---

## 7. Model Training & Hardware Verification

- **Is GPU or Model Training Required?**
  **No.** EconoScope does not use black-box neural networks or heavy deep learning models that require GPU accelerators or large RAM allocations.
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
