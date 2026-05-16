#!/bin/bash
set -e

echo "🔨 Building DocVault DMS Docker Images for Kubernetes..."
echo "=================================================="

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Build Auth Service
echo -e "${BLUE}📦 Building Auth Service...${NC}"
cd services/auth
./mvnw clean package -DskipTests
docker build -t dms-auth:latest .
echo -e "${GREEN}✅ Auth Service built${NC}"
cd ../..

# Build Documents Service
echo -e "${BLUE}📦 Building Documents Service...${NC}"
cd services/documents
./mvnw clean package -DskipTests
docker build -t dms-documents:latest .
echo -e "${GREEN}✅ Documents Service built${NC}"
cd ../..

# Build Comments Service
echo -e "${BLUE}📦 Building Comments Service...${NC}"
cd services/comments
./mvnw clean package -DskipTests
docker build -t dms-comments:latest .
echo -e "${GREEN}✅ Comments Service built${NC}"
cd ../..

# Build Gateway
echo -e "${BLUE}📦 Building Gateway...${NC}"
cd services/gateway
./mvnw clean package -DskipTests
docker build -t dms-gateway:latest .
echo -e "${GREEN}✅ Gateway built${NC}"
cd ../..

# Build Translator Service (if exists)
if [ -d "services/translator" ]; then
    echo -e "${BLUE}📦 Building Translator Service...${NC}"
    cd services/translator
    docker build -t dms-translator:latest .
    echo -e "${GREEN}✅ Translator Service built${NC}"
    cd ../..
fi

# Build Translation Consumer (if exists)
if [ -d "services/translation-consumer" ]; then
    echo -e "${BLUE}📦 Building Translation Consumer...${NC}"
    cd services/translation-consumer
    docker build -t dms-translation-consumer:latest .
    echo -e "${GREEN}✅ Translation Consumer built${NC}"
    cd ../..
fi

# Build Frontend
echo -e "${BLUE}📦 Building Frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi
npm run build
docker build -t dms-ui:latest .
echo -e "${GREEN}✅ Frontend built${NC}"
cd ..

echo ""
echo "=================================================="
echo -e "${GREEN}✅ All images built successfully!${NC}"
echo ""
echo "Built images:"
docker images | grep -E "dms-|REPOSITORY"

echo ""
echo "Next steps:"
echo "1. For Minikube: minikube image load <image-name>"
echo "2. For K8s: kubectl apply -f infra/k8s/"
echo "3. For Docker Compose: docker-compose -f infra/docker/docker-compose.full.yml up -d"
