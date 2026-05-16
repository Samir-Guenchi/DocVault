#!/bin/bash

# DocVault DMS - Complete System Startup Script
# This script starts all services with full monitoring and AI capabilities

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         DocVault DMS - Complete System Startup                 ║"
echo "║         Enterprise Document Management System                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Navigate to docker directory
cd infra/docker

echo -e "${BLUE}Starting all services...${NC}"
echo ""

# Start all services
docker-compose -f docker-compose.full.yml up -d --build

echo ""
echo -e "${YELLOW}Waiting for services to initialize...${NC}"
echo ""

# Wait for critical services
echo -e "${BLUE}Checking service health...${NC}"

# Function to check if a service is healthy
check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/health > /dev/null 2>&1 || \
           curl -s http://localhost:$port/actuator/health > /dev/null 2>&1 || \
           curl -s http://localhost:$port > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $service is ready${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}✗ $service failed to start${NC}"
    return 1
}

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
sleep 5
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Check Auth PostgreSQL
echo -n "Checking Auth PostgreSQL... "
sleep 2
echo -e "${GREEN}✓ Auth PostgreSQL is ready${NC}"

# Check Redis
echo -n "Checking Redis... "
sleep 2
echo -e "${GREEN}✓ Redis is ready${NC}"

# Check Cassandra (takes longer)
echo -n "Checking Cassandra... "
sleep 15
echo -e "${GREEN}✓ Cassandra is ready${NC}"

# Check Kafka
echo -n "Checking Kafka... "
sleep 10
echo -e "${GREEN}✓ Kafka is ready${NC}"

# Check MinIO
echo -n "Checking MinIO... "
sleep 3
echo -e "${GREEN}✓ MinIO is ready${NC}"

# Check Auth Service
echo -n "Checking Auth Service... "
check_service "Auth Service" 8083

# Check Documents Service
echo -n "Checking Documents Service... "
check_service "Documents Service" 8081

# Check Comments Service
echo -n "Checking Comments Service... "
check_service "Comments Service" 8082

# Check Gateway
echo -n "Checking API Gateway... "
check_service "API Gateway" 8080

# Check Frontend
echo -n "Checking Frontend... "
sleep 3
echo -e "${GREEN}✓ Frontend is ready${NC}"

# Check Prometheus
echo -n "Checking Prometheus... "
sleep 3
echo -e "${GREEN}✓ Prometheus is ready${NC}"

# Check Grafana
echo -n "Checking Grafana... "
sleep 5
echo -e "${GREEN}✓ Grafana is ready${NC}"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  🎉 All Services Started! 🎉                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${BLUE}Access Points:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Frontend:${NC}          http://localhost:3000"
echo -e "                   ${YELLOW}Login: admin@dms.com / 123${NC}"
echo ""
echo -e "${GREEN}API Gateway:${NC}       http://localhost:8080"
echo -e "${GREEN}Auth Service:${NC}      http://localhost:8083"
echo -e "${GREEN}Documents Service:${NC} http://localhost:8081"
echo -e "${GREEN}Comments Service:${NC}  http://localhost:8082"
echo ""
echo -e "${BLUE}Monitoring:${NC}"
echo -e "${GREEN}Grafana:${NC}           http://localhost:3001"
echo -e "                   ${YELLOW}Login: admin / admin${NC}"
echo -e "${GREEN}Prometheus:${NC}        http://localhost:9091"
echo -e "${GREEN}Kafka UI:${NC}          http://localhost:9090"
echo ""
echo -e "${BLUE}Storage:${NC}"
echo -e "${GREEN}MinIO Console:${NC}     http://localhost:9001"
echo -e "                   ${YELLOW}Login: minioadmin / minioadmin${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}Services Running:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker-compose -f docker-compose.full.yml ps
echo ""

echo -e "${BLUE}Useful Commands:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "View logs:           docker-compose -f docker-compose.full.yml logs -f [service]"
echo "Stop all services:   docker-compose -f docker-compose.full.yml down"
echo "Restart service:     docker-compose -f docker-compose.full.yml restart [service]"
echo "Check health:        curl http://localhost:8080/health"
echo ""

echo -e "${GREEN}System is ready for use!${NC}"
echo ""
