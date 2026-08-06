@echo off
cd /d "%~dp0"
echo Step 1: Approving esbuild scripts...
"C:\Program Files\nodejs\npm.cmd" pkg approve-scripts esbuild 2>nul
"C:\Program Files\nodejs\npm.cmd" approve-scripts esbuild 2>nul

echo Step 2: Running esbuild postinstall manually...
if exist "node_modules\esbuild\install.js" (
    "C:\Program Files\nodejs\node.exe" node_modules\esbuild\install.js
)

echo Step 3: Verifying vite binary...
if exist "node_modules\.bin\vite.cmd" (
    echo Vite is ready at node_modules\.bin\vite.cmd
) else (
    echo Vite not found, running full install...
    "C:\Program Files\nodejs\npm.cmd" install --ignore-scripts
)

echo.
echo Setup complete. Starting dev server...
"C:\Program Files\nodejs\npm.cmd" run dev
