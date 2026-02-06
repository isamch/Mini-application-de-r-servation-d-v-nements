#!/bin/bash

# Simple deployment script
echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Build the application
npm run build

# Restart the application (using PM2 or similar)
# pm2 restart backend-app

echo "Deployment completed!"