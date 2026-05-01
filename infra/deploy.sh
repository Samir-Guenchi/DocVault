#!/bin/bash
set -e

echo "══════════════════════════════════════════════════"
echo "  DocVault DMS — Production Deployment"
echo "══════════════════════════════════════════════════"

cd "$(dirname "$0")"

MODE="${1:-lite}"

if [ "$MODE" = "full" ]; then
  echo "▸ Starting FULL stack (Kafka, Redis, Cassandra, Translator)..."
  docker-compose -f docker/docker-compose.full.yml up --build -d
  echo ""
  echo "  UI:        http://localhost:3000"
  echo "  Gateway:   http://localhost:8080"
  echo "  Kafka UI:  http://localhost:9090"
else
  echo "▸ Starting LITE stack (PostgreSQL, Documents, Gateway, UI)..."
  docker-compose -f docker/docker-compose.yml up --build -d
  echo ""
  echo "  UI:        http://localhost:3000"
  echo "  Gateway:   http://localhost:8080"
fi

echo "══════════════════════════════════════════════════"
echo "  ✓ Deployment Complete"
echo "══════════════════════════════════════════════════"
