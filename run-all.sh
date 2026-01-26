#!/bin/bash

# Master script to run all services for the delivery application
# Usage: ./run-all.sh

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "======================================"
echo "Running Delivery Application"
echo "======================================"
echo ""

# Create a Docker network if it doesn't exist
echo -e "${BLUE}Creating Docker network...${NC}"
docker network create delivery-network 2>/dev/null || echo -e "${YELLOW}Network already exists${NC}"
echo ""

# Function to wait for a service to be healthy
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $service_name to be ready on port $port...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/actuator/health >/dev/null 2>&1; then
            echo -e "${GREEN}âœ“ $service_name is ready!${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo -e "${RED}âœ— $service_name failed to start within expected time${NC}"
    return 1
}

# Stop and remove existing containers
echo -e "${BLUE}Stopping and removing existing containers...${NC}"
docker stop delivery-service-registry 2>/dev/null || true
docker stop delivery-config-server 2>/dev/null || true
docker stop delivery-order-service 2>/dev/null || true
docker stop delivery-delivery-service 2>/dev/null || true
docker stop delivery-deliverer-service 2>/dev/null || true
docker stop delivery-api-gateway 2>/dev/null || true

docker rm delivery-service-registry 2>/dev/null || true
docker rm delivery-config-server 2>/dev/null || true
docker rm delivery-order-service 2>/dev/null || true
docker rm delivery-delivery-service 2>/dev/null || true
docker rm delivery-deliverer-service 2>/dev/null || true
docker rm delivery-api-gateway 2>/dev/null || true
echo -e "${GREEN}âœ“ Cleaned up existing containers${NC}"
echo ""

# Start Service Registry (must be first)
echo -e "${BLUE}[1/7] Starting Service Registry...${NC}"
docker run -d \
    --name delivery-service-registry \
    --network delivery-network \
    -p 8761:8761 \
    delivery-app/service-registry:latest

echo -e "${GREEN}âœ“ Service Registry started${NC}"
wait_for_service "Service Registry" 8761
echo ""

# Start Config Server (second)
echo -e "${BLUE}[2/7] Starting Config Server...${NC}"
docker run -d \
    --name delivery-config-server \
    --network delivery-network \
    -p 8888:8888 \
    -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://delivery-service-registry:8761/eureka/ \
    delivery-app/config-server:latest

echo -e "${GREEN}âœ“ Config Server started${NC}"
wait_for_service "Config Server" 8888
echo ""

# Start Order Service
echo -e "${BLUE}[3/7] Starting Order Service...${NC}"
docker run -d \
    --name delivery-order-service \
    --network delivery-network \
    -p 8001:8001 \
    -v "$(pwd)/order-service/database:/app/database" \
    -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://delivery-service-registry:8761/eureka/ \
    delivery-app/order-service:latest

echo -e "${GREEN}âœ“ Order Service started${NC}"
echo ""

# Start Delivery Service
echo -e "${BLUE}[4/7] Starting Delivery Service...${NC}"
docker run -d \
    --name delivery-delivery-service \
    --network delivery-network \
    -p 8002:8002 \
    -v "$(pwd)/delivery-service/database:/app/database" \
    -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://delivery-service-registry:8761/eureka/ \
    delivery-app/delivery-service:latest

echo -e "${GREEN}âœ“ Delivery Service started${NC}"
echo ""

# Start Deliverer Service
echo -e "${BLUE}[5/7] Starting Deliverer Service...${NC}"
docker run -d \
    --name delivery-deliverer-service \
    --network delivery-network \
    -p 8003:8003 \
    -v "$(pwd)/deliverer-service/database:/app/database" \
    -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://delivery-service-registry:8761/eureka/ \
    delivery-app/deliverer-service:latest

echo -e "${GREEN}âœ“ Deliverer Service started${NC}"
echo ""

# Start API Gateway
echo -e "${BLUE}[6/7] Starting API Gateway...${NC}"
docker run -d \
    --name delivery-api-gateway \
    --network delivery-network \
    -p 8000:8000 \
    -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://delivery-service-registry:8761/eureka/ \
    delivery-app/api-gateway:latest

echo -e "${GREEN}âœ" API Gateway started${NC}"
wait_for_service "API Gateway" 8000
echo ""

# Start Frontend (Next.js application)
echo -e "${BLUE}[7/7] Starting Frontend Application...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Start Next.js in development mode in the background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .next-pid
cd ..

echo -e "${GREEN}âœ" Frontend Application started (PID: $FRONTEND_PID)${NC}"
echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
sleep 5
echo ""

echo "======================================"
echo -e "${GREEN}All services are running!${NC}"
echo "======================================"
echo ""

echo "Service URLs:"
echo "  - Frontend Application:      http://localhost:3000"
echo "  - API Gateway:               http://localhost:8000"
echo "  - Service Registry (Eureka): http://localhost:8761"
echo "  - Config Server:             http://localhost:8888"
echo "  - Order Service:             http://localhost:8001"
echo "  - Delivery Service:          http://localhost:8002"
echo "  - Deliverer Service:         http://localhost:8003"
echo ""

echo "To view logs:"
echo "  Frontend:          tail -f frontend.log"
echo "  Service Registry:  docker logs -f delivery-service-registry"
echo "  Config Server:     docker logs -f delivery-config-server"
echo "  Order Service:     docker logs -f delivery-order-service"
echo "  Delivery Service:  docker logs -f delivery-delivery-service"
echo "  Deliverer Service: docker logs -f delivery-deliverer-service"
echo "  API Gateway:       docker logs -f delivery-api-gateway"
echo ""

echo "To stop all services:"
echo "  ./stop-all.sh"
echo "  OR manually:"
echo "  kill \$(cat frontend/.next-pid) && docker stop delivery-service-registry delivery-config-server delivery-order-service delivery-delivery-service delivery-deliverer-service delivery-api-gateway"
echo ""

echo "To view all running containers:"
echo "  docker ps"
echo ""

echo -e "${GREEN}🚀 DeliveryHub is ready!${NC}"
echo -e "Open your browser and navigate to: ${BLUE}http://localhost:3000${NC}"
