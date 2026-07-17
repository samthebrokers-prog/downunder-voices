@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo.
echo =====================================================
echo Downunder Voices - direct verified deployment
echo =====================================================
echo This deploys directly from this folder.
echo It does NOT copy or modify the old repair folder.
echo.

if not exist "package.json" (
  echo ERROR: package.json is missing. Please Extract All first.
  pause
  exit /b 1
)
if not exist "app\api\admin\health\route.ts" (
  echo ERROR: Verified health route is missing.
  pause
  exit /b 1
)
if not exist "app\admin\page.tsx" (
  echo ERROR: Verified admin page is missing.
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

echo Step 1 of 3: Linking this clean folder to the existing Vercel project...
call npx.cmd vercel@latest link --yes --project rebuild-community-news-site --scope downundervoicecom
if errorlevel 1 (
  echo.
  echo ERROR: Vercel could not link the project.
  echo If it says your login expired, run: npx.cmd vercel@latest login
  pause
  exit /b 1
)

echo.
echo Step 2 of 3: Deploying the complete verified source to Production...
call npx.cmd vercel@latest --prod --force --logs --scope downundervoicecom
if errorlevel 1 (
  echo.
  echo ERROR: Vercel did not complete the deployment.
  echo The previous live deployment remains available.
  pause
  exit /b 1
)

echo.
echo Step 3 of 3: Confirming the new admin health route is live...
set "STATUS="
for /L %%N in (1,1,8) do (
  timeout /t 5 /nobreak >nul
  for /f %%S in ('curl.exe -s -o NUL -w "%%{http_code}" "https://www.downundervoices.com/api/admin/health"') do set "STATUS=%%S"
  echo Check %%N: HTTP !STATUS!
  if not "!STATUS!"=="404" goto :verified
)

:verified
if "!STATUS!"=="404" (
  echo.
  echo ERROR: Vercel is still serving an older source version.
  echo Send a screenshot of this window.
  pause
  exit /b 1
)

echo.
echo =====================================================
echo SUCCESS - verified source is live
echo =====================================================
echo Health route status: HTTP !STATUS!
echo HTTP 401 is normal until you sign in to the admin page.
echo Open: https://www.downundervoices.com/admin/login
echo.
pause
