#!/bin/bash

# Master script to build all Docker images for the delivery application
# Usage: ./build-all.sh

set -e

echo "======================================"
echo "Building Delivery Application Images"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Build Service Registry
echo -e "${BLUE}[1/6] Building Service Registry...${NC}"
docker build -t delivery-app/service-registry:latest ./service-registry
echo -e "${GREEN}âœ“ Service Registry built successfully${NC}"
echo ""

# Build Config Server
echo -e "${BLUE}[2/6] Building Config Server...${NC}"
docker build -t delivery-app/config-server:latest ./config-server
echo -e "${GREEN}âœ“ Config Server built successfully${NC}"
echo ""

# Build Order Service
echo -e "${BLUE}[3/6] Building Order Service...${NC}"
docker build -t delivery-app/order-service:latest ./order-service
echo -e "${GREEN}âœ“ Order Service built successfully${NC}"
echo ""

# Build Delivery Service
echo -e "${BLUE}[4/6] Building Delivery Service...${NC}"
docker build -t delivery-app/delivery-service:latest ./delivery-service
echo -e "${GREEN}âœ“ Delivery Service built successfully${NC}"
echo ""

# Build Deliverer Service
echo -e "${BLUE}[5/6] Building Deliverer Service...${NC}"
docker build -t delivery-app/deliverer-service:latest ./deliverer-service
echo -e "${GREEN}âœ“ Deliverer Service built successfully${NC}"
echo ""

# Build API Gateway
echo -e "${BLUE}[6/6] Building API Gateway...${NC}"
docker build -t delivery-app/api-gateway:latest ./api-gateway
echo -e "${GREEN}âœ“ API Gateway built successfully${NC}"
echo ""

echo "======================================"
echo -e "${GREEN}All images built successfully!${NC}"
echo "======================================"
echo ""

echo "Available images:"
docker images | grep delivery-app

echo ""
echo "To run the services, execute:"
echo "  ./run-all.sh"
