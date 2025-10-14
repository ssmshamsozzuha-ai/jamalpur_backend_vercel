#!/bin/bash

# Vercel Backend Deployment Script
# This script automates the deployment process to Vercel

echo "🚀 Starting Vercel Backend Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

# Navigate to backend directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found. Please ensure the Vercel configuration is set up."
    exit 1
fi

echo "✅ Configuration files found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Test your API endpoints"
echo "3. Update frontend configuration"
echo ""
echo "🔗 Check your deployment at: https://your-project.vercel.app"
echo "🏥 Health check: https://your-project.vercel.app/api/health"
