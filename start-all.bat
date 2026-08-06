@echo off
echo ==========================================
echo  ASR Digital Client Dashboard
echo  Starting Backend + Frontend
echo ==========================================
echo.
echo [1/2] Launching backend in new window...
start "ASR Backend" cmd /k "%~dp0start-backend.bat"

timeout /t 5 /nobreak >nul

echo [2/2] Launching frontend in new window...
start "ASR Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo Both servers are starting...
echo.
echo   Backend  : http://localhost:8000
echo   Frontend : http://localhost:5173
echo   API Docs : http://localhost:8000/docs
echo.
echo Open http://localhost:5173 in your browser.
echo Login: admin@asr.digital / demo1234
echo.
pause
