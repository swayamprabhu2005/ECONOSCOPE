@echo off
setlocal enabledelayedexpansion
title EconoScope - Maritime Governance Geospatial Intelligence Platform

echo ==============================================================================
echo        ECONOSCOPE : GEOSPATIAL INTELLIGENCE PLATFORM (GOA PILOT)
echo              IDEAS 5.0 - THEME: MARITIME GOVERNANCE
echo ==============================================================================
echo.

:: 1. Verify Node.js presence and version
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your PATH.
    echo Please install Node.js 22.5 or higher from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo [*] Detected Node.js: %NODE_VERSION%

:: 2. Ensure server dependencies
if not exist "server\node_modules" (
    echo [*] Installing server dependencies...
    call npm --prefix server install
)

:: 3. Ensure client dependencies
if not exist "client\node_modules" (
    echo [*] Installing client dependencies...
    call npm --prefix client install
)

:: 4. Ensure root dependencies (concurrently)
if not exist "node_modules" (
    echo [*] Installing runner dependencies...
    call npm install
)

:: 5. Ensure database is seeded
if not exist "server\data\econoscope.db" (
    echo [*] Initializing and seeding demo database (549 zones, 36 months of data)...
    call npm --prefix server run seed
)

echo.
echo ==============================================================================
echo  Starting EconoScope Full-Stack Platform...
echo  - Backend API:  http://localhost:4000 (Express + SQLite WAL Engine)
echo  - Frontend Web: http://localhost:5173 (React + Vite + Leaflet + H3)
echo ==============================================================================
echo.
echo Press Ctrl+C at any time to stop the application.
echo.

:: Open browser automatically after a short delay
start "" http://localhost:5173

:: Run concurrently
npm run dev
