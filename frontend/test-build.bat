@echo off
echo ============================================
echo Testing CuraGenie Frontend Build Locally
echo ============================================
echo.

echo [1/3] Checking Node version...
node --version
echo.

echo [2/3] Installing dependencies...
call npm install
echo.

echo [3/3] Running production build...
call npm run build
echo.

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo ✅ BUILD SUCCESSFUL!
    echo ============================================
    echo.
    echo The build completed successfully locally.
    echo If Vercel build fails, the issue is likely:
    echo   - Environment variables
    echo   - Node version mismatch
    echo   - Vercel-specific configuration
    echo.
) else (
    echo ============================================
    echo ❌ BUILD FAILED!
    echo ============================================
    echo.
    echo The same error will occur on Vercel.
    echo Check the error messages above to identify the issue.
    echo.
)

pause
