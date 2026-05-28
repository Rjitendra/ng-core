#!/bin/bash

# This script manages Docker Compose for local development

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command
COMMAND=${1:-help}

show_help() {
    cat <<EOF
${BLUE}ng-core Docker Compose Manager${NC}

Usage: ./docker-compose-manager.sh [command] [options]

Commands:
    up              Start development environment
    down            Stop development environment
    logs            Show application logs
    logs -f         Follow application logs
    build           Build development image
    clean           Clean up containers and volumes
    restart         Restart application
    shell           Open shell in running container
    test            Run tests in container
    help            Show this help message

Examples:
    ./docker-compose-manager.sh up
    ./docker-compose-manager.sh logs -f
    ./docker-compose-manager.sh build
    ./docker-compose-manager.sh shell
EOF
}

case "$COMMAND" in
    up)
        echo -e "${YELLOW}Starting ng-core development environment...${NC}"
        docker-compose -f docker-compose.yml up -d
        echo -e "${GREEN}✓ Environment started${NC}"
        echo -e "${BLUE}Access application at: http://localhost:4200${NC}"
        ;;
    down)
        echo -e "${YELLOW}Stopping ng-core development environment...${NC}"
        docker-compose -f docker-compose.yml down
        echo -e "${GREEN}✓ Environment stopped${NC}"
        ;;
    logs)
        FOLLOW_FLAG=""
        [ "$2" = "-f" ] && FOLLOW_FLAG="-f"
        docker-compose -f docker-compose.yml logs $FOLLOW_FLAG ng-core-app
        ;;
    build)
        echo -e "${YELLOW}Building development image...${NC}"
        docker-compose -f docker-compose.yml build
        echo -e "${GREEN}✓ Image built${NC}"
        ;;
    clean)
        echo -e "${RED}Cleaning up Docker resources...${NC}"
        docker-compose -f docker-compose.yml down -v
        echo -e "${GREEN}✓ Cleanup complete${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Restarting application...${NC}"
        docker-compose -f docker-compose.yml restart ng-core-app
        echo -e "${GREEN}✓ Application restarted${NC}"
        ;;
    shell)
        echo -e "${YELLOW}Opening shell in container...${NC}"
        docker-compose -f docker-compose.yml exec ng-core-app sh
        ;;
    test)
        echo -e "${YELLOW}Running tests...${NC}"
        docker-compose -f docker-compose.yml exec ng-core-app npm run test
        ;;
    help|*)
        show_help
        ;;
esac
