#!/bin/bash

# Script to initialize all databases
# Usage: ./init-databases.sh

set -e

echo "======================================"
echo "Initializing All Databases"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize Order Service Database
echo -e "${BLUE}[1/3] Initializing Order Service Database...${NC}"
cd order-service/database
chmod +x create_db.sh
./create_db.sh orders.db
cd ../..
echo -e "${GREEN}✓ Order Service database initialized${NC}"
echo ""

# Initialize Delivery Service Database
echo -e "${BLUE}[2/3] Initializing Delivery Service Database...${NC}"
cd delivery-service/database
chmod +x create_db.sh
./create_db.sh deliveries.db
cd ../..
echo -e "${GREEN}✓ Delivery Service database initialized${NC}"
echo ""

# Initialize Deliverer Service Database
echo -e "${BLUE}[3/3] Initializing Deliverer Service Database...${NC}"
cd deliverer-service/database
chmod +x create_db.sh
./create_db.sh deliverers.db
cd ../..
echo -e "${GREEN}✓ Deliverer Service database initialized${NC}"
echo ""

echo "======================================"
echo -e "${GREEN}All databases initialized!${NC}"
echo "======================================"
echo ""

echo "Database locations:"
echo "  - order-service/database/orders.db"
echo "  - delivery-service/database/deliveries.db"
echo "  - deliverer-service/database/deliverers.db"
echo ""

echo "To inspect a database, run:"
echo "  sqlite3 order-service/database/orders.db"
