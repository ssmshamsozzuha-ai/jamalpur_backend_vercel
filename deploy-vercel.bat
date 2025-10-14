@echo off
echo 🚀 Starting Vercel Backend Deployment...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing now...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel first:
    vercel login
)

REM Navigate to backend directory
cd /d "%~dp0"

echo 📁 Current directory: %CD%

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the backend directory.
    pause
    exit /b 1
)

REM Check if vercel.json exists
if not exist "vercel.json" (
    echo ❌ vercel.json not found. Please ensure the Vercel configuration is set up.
    pause
    exit /b 1
)

echo ✅ Configuration files found

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment completed!
echo.
echo 📋 Next steps:
echo 1. Set up environment variables in Vercel dashboard
echo 2. Test your API endpoints
echo 3. Update frontend configuration
echo.
echo 🔗 Check your deployment at: https://your-project.vercel.app
echo 🏥 Health check: https://your-project.vercel.app/api/health

pause
