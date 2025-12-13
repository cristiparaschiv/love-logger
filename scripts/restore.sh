#!/bin/bash
# Restore script for Love Logger
# Restores database and uploads from a backup archive

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: No backup file specified${NC}"
    echo ""
    echo "Usage: ./scripts/restore.sh <backup-file>"
    echo ""
    echo "Available backups:"
    ls -la ./backups/*.tar.gz 2>/dev/null || echo "  No backups found in ./backups/"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting Love Logger restore...${NC}"
echo "Backup file: ${BACKUP_FILE}"
echo ""

# Confirm with user
read -p "This will overwrite existing data. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf ${TEMP_DIR}" EXIT

# Extract backup
echo "Extracting backup..."
tar -xzf "${BACKUP_FILE}" -C "${TEMP_DIR}"
BACKUP_NAME=$(ls "${TEMP_DIR}")
BACKUP_PATH="${TEMP_DIR}/${BACKUP_NAME}"

# Check if containers are running
if ! docker ps | grep -q love-logger-backend; then
    echo "Starting backend container..."
    docker-compose up -d backend
    sleep 5
fi

# Restore database
if [ -f "${BACKUP_PATH}/love-logger.db" ]; then
    echo "Restoring database..."
    docker cp "${BACKUP_PATH}/love-logger.db" love-logger-backend:/tmp/love-logger.db
    docker exec love-logger-backend sh -c "cp /tmp/love-logger.db /app/data/love-logger.db"
    echo "  Database restored."
else
    echo "  No database in backup, skipping."
fi

# Restore uploads
if [ -d "${BACKUP_PATH}/uploads" ] && [ "$(ls -A ${BACKUP_PATH}/uploads 2>/dev/null)" ]; then
    echo "Restoring uploads..."
    # Clear existing uploads and copy new ones
    docker exec love-logger-backend sh -c "rm -rf /app/uploads/*"
    docker cp "${BACKUP_PATH}/uploads/." love-logger-backend:/app/uploads/
    echo "  Uploads restored."
else
    echo "  No uploads in backup, skipping."
fi

# Restart backend to pick up restored data
echo "Restarting backend..."
docker-compose restart backend

echo -e "${GREEN}Restore complete!${NC}"
echo ""
echo "Please refresh your browser to see the restored data."
