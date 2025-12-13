#!/bin/bash
# Backup script for Love Logger
# Creates a timestamped backup of database and uploads

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="love-logger-backup-${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Love Logger backup...${NC}"

# Create backup directory
mkdir -p "${BACKUP_PATH}"

# Check if containers are running
if ! docker ps | grep -q love-logger-backend; then
    echo "Warning: Backend container is not running. Starting it temporarily..."
    docker-compose up -d backend
    sleep 5
fi

# Backup SQLite database
echo "Backing up database..."
docker exec love-logger-backend sh -c "cp /app/data/love-logger.db /tmp/love-logger.db 2>/dev/null || echo 'No database found'"
docker cp love-logger-backend:/tmp/love-logger.db "${BACKUP_PATH}/love-logger.db" 2>/dev/null || echo "No database to backup (might be first run)"

# Backup uploads directory
echo "Backing up uploads..."
docker cp love-logger-backend:/app/uploads "${BACKUP_PATH}/uploads" 2>/dev/null || mkdir -p "${BACKUP_PATH}/uploads"

# Create archive
echo "Creating archive..."
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
rm -rf "${BACKUP_NAME}"
cd ..

# Show result
BACKUP_FILE="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)

echo -e "${GREEN}Backup complete!${NC}"
echo "  File: ${BACKUP_FILE}"
echo "  Size: ${BACKUP_SIZE}"
echo ""
echo "To restore, run: ./scripts/restore.sh ${BACKUP_FILE}"
