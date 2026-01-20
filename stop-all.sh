#!/bin/bash

# Script to stop all Docker containers for the delivery application
# Usage: ./stop-all.sh

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Stopping Delivery Application"
echo "======================================"
echo ""

# Stop all containers
echo -e "${BLUE}Stopping all containers...${NC}"
docker stop delivery-api-gateway 2>/dev/null || echo -e "${YELLOW}API Gateway not running${NC}"
docker stop delivery-deliverer-service 2>/dev/null || echo -e "${YELLOW}Deliverer Service not running${NC}"
docker stop delivery-delivery-service 2>/dev/null || echo -e "${YELLOW}Delivery Service not running${NC}"
docker stop delivery-order-service 2>/dev/null || echo -e "${YELLOW}Order Service not running${NC}"
docker stop delivery-config-server 2>/dev/null || echo -e "${YELLOW}Config Server not running${NC}"
docker stop delivery-service-registry 2>/dev/null || echo -e "${YELLOW}Service Registry not running${NC}"
echo ""

# Remove all containers
echo -e "${BLUE}Removing all containers...${NC}"
docker rm delivery-api-gateway 2>/dev/null || true
docker rm delivery-deliverer-service 2>/dev/null || true
docker rm delivery-delivery-service 2>/dev/null || true
docker rm delivery-order-service 2>/dev/null || true
docker rm delivery-config-server 2>/dev/null || true
docker rm delivery-service-registry 2>/dev/null || true
echo ""

echo "======================================"
echo -e "${GREEN}All services stopped!${NC}"
echo "======================================"
echo ""

echo "To remove the Docker network:"
echo "  docker network rm delivery-network"
echo ""

echo "To view remaining containers:"
echo "  docker ps -a"
