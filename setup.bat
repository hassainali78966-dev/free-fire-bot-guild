# Quick start script for Windows

@echo off
echo.
echo =================================
echo Free Fire Bot Guild System Setup
echo =================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js 12+
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo Installing dependencies...
call npm install

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file and set your Guild ID
echo 2. Run: npm start
echo 3. Call: curl -X POST http://localhost:3000/api/quick-start
echo.
pause
