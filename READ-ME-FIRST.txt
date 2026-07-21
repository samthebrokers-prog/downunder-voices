@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo.
echo =====================================================
echo Downunder Voices - clean Node 20 deployment
echo =====================================================
echo This package avoids the npm/Node 24 installation bug.
echo The current live website remains online unless this build succeeds.
echo.

if not exist "package.json" (
  echo ERROR: package.json is missing. Please Extract All first.
  pause
  exit /b 1
)
if exist "package-lock.json" (
  echo ERROR: An old package-lock.json is present. Use this clean folder only.
  pause
  exit /b 1
)
if not exist ".npmrc" (
  echo ERROR: .npmrc is missing.
  pause
  exit /b 1
)
if not exist "app\api\admin\health\route.ts" (
  echo ERROR: Admin health route is missing.
  pause
  exit /b 1
)
where node.exe >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or Windows cannot find it.
  pause
  exit /b 1
)
where npx.cmd >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm/npx is not available.
  pause
  exit /b 1
)

echo Step 1 of 2: Linking to the existing Vercel project...
call npx.cmd vercel@latest link --yes --project rebuild-community-news-site --scope downundervoicecom
if errorlevel 1 (
  echo.
  echo ERROR: Vercel could not link the project.
  echo If login expired, run: npx.cmd vercel@latest login
  pause
  exit /b 1
)

echo.
echo Step 2 of 2: Deploying with Node 20 and the public npm registry...
call npx.cmd vercel@latest --prod --force --logs --scope downundervoicecom
if errorlevel 1 (
  echo.
  echo ERROR: Vercel did not complete the deployment.
  echo The previous live deployment remains available.
  pause
  exit /b 1
)

echo.
echo =====================================================
echo SUCCESS - deployment completed
 echo =====================================================
echo Open: https://www.downundervoices.com/admin/login
echo.
pause
