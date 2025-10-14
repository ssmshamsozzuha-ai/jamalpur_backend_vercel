@echo off
echo.
echo ========================================
echo    INSTALLING PROJECT DEPENDENCIES
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
cd ..
echo ✅ Backend dependencies installed!
echo.

echo Step 2: Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo ✅ Frontend dependencies installed!
echo.

echo ========================================
echo    INSTALLATION COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend/.env with your credentials
echo 2. Run start-project.bat to start the application
echo.
pause



