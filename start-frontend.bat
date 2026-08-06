@echo off
echo ==========================================
echo  ASR Digital Dashboard - Frontend Server
echo ==========================================
cd /d "%~dp0frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm packages... (this may take a minute)
    npm install
)

echo.
echo Starting frontend on http://localhost:5173
echo.
npm run dev
pause
