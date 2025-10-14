#!/bin/bash

# Jamalpur Chamber Deployment Script
echo "🚀 Starting Jamalpur Chamber Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All requirements met!"
}

# Build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    
    cd frontend
    npm install
    npm run build:prod
    
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully!"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    
    cd backend
    npm install --production
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed!"
    else
        print_error "Backend dependency installation failed!"
        exit 1
    fi
    
    cd ..
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Create deployment directory
    mkdir -p deployment
    
    # Copy frontend build
    cp -r frontend/build deployment/
    
    # Copy backend
    cp -r backend deployment/
    
    # Copy configuration files
    cp vercel.json deployment/
    cp render.yaml deployment/
    
    print_success "Deployment package created!"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "   JAMALPUR CHAMBER DEPLOYMENT SCRIPT"
    echo "=========================================="
    echo ""
    
    check_requirements
    build_frontend
    install_backend
    create_deployment_package
    
    echo ""
    echo "=========================================="
    print_success "Deployment package ready!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Deploy frontend to Vercel"
    echo "2. Deploy backend to Render"
    echo "3. Set up MongoDB Atlas"
    echo "4. Configure environment variables"
    echo ""
    print_success "Deployment script completed!"
}

# Run main function
main
