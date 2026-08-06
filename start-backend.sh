#!/bin/bash
echo "=========================================="
echo " ASR Digital Dashboard - Backend Server"
echo "=========================================="
cd "$(dirname "$0")/backend"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

echo ""
echo "Starting FastAPI backend on http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
uvicorn main:app --reload --port 8000 --host 0.0.0.0
