#!/bin/bash
echo "=========================================="
echo " ASR Digital Dashboard - Frontend Server"
echo "=========================================="
cd "$(dirname "$0")/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
fi

echo ""
echo "Starting frontend on http://localhost:5173"
echo ""
npm run dev
