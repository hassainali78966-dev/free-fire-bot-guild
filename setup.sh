#!/bin/bash

# Free Fire Bot Guild System - Setup Script

echo ""
echo "================================="
echo "Free Fire Bot Guild System Setup"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 12+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and set your Guild ID"
echo "2. Run: npm start"
echo "3. Call: curl -X POST http://localhost:3000/api/quick-start"
echo ""
