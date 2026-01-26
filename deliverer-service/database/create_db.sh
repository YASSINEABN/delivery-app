#!/bin/bash

# Script to create and initialize the Deliverer Service database
# Usage: ./create_db.sh [database_name]

DB_NAME="${1:-deliverers.db}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Creating Deliverer Service database: $DB_NAME"

# Remove existing database if it exists
if [ -f "$DB_NAME" ]; then
    echo "Warning: Database $DB_NAME already exists. It will be removed."
    rm "$DB_NAME"
fi

# Create database and run initialization script
sqlite3 "$DB_NAME" < "$SCRIPT_DIR/init.sql"

if [ $? -eq 0 ]; then
    echo "âœ“ Database created successfully!"
    echo "âœ“ Schema initialized"
    echo "âœ“ Sample data inserted"
    echo ""
    echo "Database location: $(pwd)/$DB_NAME"
    echo ""
    echo "To connect to the database, run:"
    echo "  sqlite3 $DB_NAME"
else
    echo "âœ— Error creating database"
    exit 1
fi
