@echo off
echo.
echo ========================================
echo    STARTING JAMALPUR CHAMBER PROJECT
echo ========================================
echo.

echo Step 1: Stopping any existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Starting Backend Server (Port 5000)...
start "Backend Server - Port 5000" cmd /k "cd /d %~dp0backend && echo. && echo ========================================= && echo    BACKEND SERVER - PORT 5000 && echo ========================================= && echo. && npm start"

echo Step 3: Waiting for backend to initialize...
timeout /t 4 /nobreak >nul

echo Step 4: Starting Frontend Server (Port 3000)...
start "Frontend Server - Port 3000" cmd /k "cd /d %~dp0frontend && echo. && echo ========================================= && echo    FRONTEND SERVER - PORT 3000 && echo ========================================= && echo. && npm start"

echo.
echo ✅ Both servers are starting!
echo.
echo Backend API: http://localhost:5000/api
echo Frontend: http://localhost:3000
echo.
echo Wait 30 seconds for React to compile...
echo Then your browser will open automatically!
echo.
echo Press any key to close this window...
pause >nul
