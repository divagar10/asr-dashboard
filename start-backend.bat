@echo off
echo ==========================================
echo  ASR Digital Dashboard - Backend Server
echo ==========================================
cd /d "%~dp0backend"

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo Starting FastAPI backend on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
uvicorn main:app --reload --port 8000 --host 0.0.0.0
pause
