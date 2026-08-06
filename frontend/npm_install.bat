@echo off
cd /d "%~dp0"
echo Installing npm packages...
"C:\Program Files\nodejs\npm.cmd" install --foreground-scripts
echo.
echo npm install complete. Exit code: %ERRORLEVEL%
