#!/bin/bash
# Change password script for Love Logger
# Works with Docker containers

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔐 Love Logger - Password Change Utility${NC}\n"

# Check if running in Docker
if docker ps | grep -q love-logger-backend; then
    DOCKER_MODE=true
    echo "Detected Docker environment"
else
    DOCKER_MODE=false
    echo "Running in local environment"
fi

# Check command line arguments for non-interactive mode
if [ $# -ge 2 ]; then
    USERNAME="$1"
    PASSWORD="$2"

    if [[ "$USERNAME" != "he" && "$USERNAME" != "she" ]]; then
        echo -e "${RED}❌ Invalid username. Must be 'he' or 'she'${NC}"
        exit 1
    fi

    if [ ${#PASSWORD} -lt 4 ]; then
        echo -e "${RED}❌ Password must be at least 4 characters${NC}"
        exit 1
    fi

    if [ "$DOCKER_MODE" = true ]; then
        docker exec -it love-logger-backend npx tsx scripts/change-password.ts "$USERNAME" "$PASSWORD"
    else
        cd "$(dirname "$0")/../backend"
        npx tsx scripts/change-password.ts "$USERNAME" "$PASSWORD"
    fi
    exit 0
fi

# Interactive mode
echo "Which user password do you want to change?"
echo "  1. he"
echo "  2. she"
echo "  3. both"
echo ""
read -p "Enter choice (1/2/3): " CHOICE

case $CHOICE in
    1) USERS="he" ;;
    2) USERS="she" ;;
    3) USERS="he she" ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

for USER in $USERS; do
    echo ""
    echo "Changing password for '$USER':"

    read -sp "  Enter new password (min 4 chars): " PASSWORD
    echo ""

    if [ ${#PASSWORD} -lt 4 ]; then
        echo -e "${RED}  ❌ Password too short, skipping...${NC}"
        continue
    fi

    read -sp "  Confirm password: " CONFIRM
    echo ""

    if [ "$PASSWORD" != "$CONFIRM" ]; then
        echo -e "${RED}  ❌ Passwords do not match, skipping...${NC}"
        continue
    fi

    if [ "$DOCKER_MODE" = true ]; then
        docker exec love-logger-backend npx tsx scripts/change-password.ts "$USER" "$PASSWORD"
    else
        cd "$(dirname "$0")/../backend"
        npx tsx scripts/change-password.ts "$USER" "$PASSWORD"
    fi
done

echo -e "\n${GREEN}Done!${NC}\n"
