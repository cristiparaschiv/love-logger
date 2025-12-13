#!/bin/bash

# Love Logger Setup Script
# This script automates the initial setup process

set -e

echo "========================================"
echo "Love Logger - Automated Setup"
echo "========================================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Error: Node.js 20 or higher is required. Current version: $(node -v)"
    exit 1
fi
echo "Node.js version: $(node -v) ✓"
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install
echo "✓ Root dependencies installed"
echo ""

# Set up backend
echo "Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cp .env.example .env

    # Generate a random JWT secret
    JWT_SECRET=$(openssl rand -base64 48)

    # Update .env with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" .env
    else
        # Linux
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" .env
    fi

    echo "✓ Backend .env created with secure JWT secret"
else
    echo "Backend .env already exists"
fi

echo "Generating Prisma client..."
npm run db:generate

echo "Running database migrations..."
npm run db:migrate -- --name init

echo "Seeding database..."
npm run db:seed

echo "✓ Backend setup complete"
echo ""

# Set up frontend
echo "Setting up frontend..."
cd ../frontend

if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo "✓ Frontend .env created"
else
    echo "Frontend .env already exists"
fi

cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the application in development mode:"
echo "  npm run dev"
echo ""
echo "Or start backend and frontend separately:"
echo "  npm run dev:backend   # Terminal 1"
echo "  npm run dev:frontend  # Terminal 2"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo ""
echo "Default credentials:"
echo "  Username: he  | Password: he123"
echo "  Username: she | Password: she123"
echo ""
echo "For more information, see README.md"
echo ""
