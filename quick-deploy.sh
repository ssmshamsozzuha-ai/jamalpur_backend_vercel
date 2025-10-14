#!/bin/bash

# Quick Deployment Script for Jamalpur Chamber
echo "🚀 Quick Deploy - Jamalpur Chamber"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   JAMALPUR CHAMBER QUICK DEPLOY${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

echo -e "${GREEN}✅ Git repository ready${NC}"

# Check if package.json exists
if [ ! -f "frontend/package.json" ] || [ ! -f "backend/package.json" ]; then
    echo -e "${YELLOW}❌ Package.json files not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure verified${NC}"

echo ""
echo -e "${BLUE}📋 DEPLOYMENT CHECKLIST:${NC}"
echo ""
echo "1. 📊 MongoDB Atlas Setup:"
echo "   - Create cluster at mongodb.com/atlas"
echo "   - Get connection string"
echo "   - Configure database user"
echo ""
echo "2. 🖥️  Render Backend Deployment:"
echo "   - Go to render.com"
echo "   - Connect GitHub repository"
echo "   - Set build command: cd backend && npm install"
echo "   - Set start command: cd backend && npm start"
echo "   - Add environment variables"
echo ""
echo "3. 🌐 Vercel Frontend Deployment:"
echo "   - Go to vercel.com"
echo "   - Connect GitHub repository"
echo "   - Set root directory: frontend"
echo "   - Set build command: npm run build:prod"
echo "   - Add environment variables"
echo ""
echo "4. 🔧 Environment Variables:"
echo "   - MONGODB_URI (from Atlas)"
echo "   - JWT_SECRET (generate secure key)"
echo "   - FRONTEND_URL (from Vercel)"
echo "   - REACT_APP_API_URL (from Render)"
echo ""

echo -e "${GREEN}📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md${NC}"
echo ""
echo -e "${BLUE}🚀 Ready to deploy! Follow the checklist above.${NC}"
