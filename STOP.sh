#!/bin/bash

# DocVault DMS - Stop All Services Script
# This script stops all running services

set -e

echo "=========================================="
echo "  DocVault DMS - Stopping All Services"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running."
    exit 1
fi

echo "Navigating to infrastructure directory..."
cd infra/docker

echo ""
echo "Stopping all services..."
docker-compose -f docker-compose.full.yml down

echo ""
echo "=========================================="
echo "  All Services Stopped Successfully!"
echo "=========================================="
echo ""
echo "To start services again, run:"
echo "  bash START.sh"
echo ""
echo "To remove all data (clean reset), run:"
echo "  cd infra/docker"
echo "  docker-compose -f docker-compose.full.yml down -v"
echo ""
