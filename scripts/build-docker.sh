#!/bin/bash

# This script builds the Docker image for ng-core

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
BUILD_TYPE=${1:-prod}
TAG=${2:-latest}

echo -e "${YELLOW}Building ng-core Docker image...${NC}"
echo "Build Type: $BUILD_TYPE"
echo "Tag: $TAG"

# Select Dockerfile based on build type
if [ "$BUILD_TYPE" = "dev" ]; then
    DOCKERFILE="Dockerfile.dev"
    IMAGE_TAG="ng-core:dev"
    echo -e "${YELLOW}Using development Dockerfile${NC}"
elif [ "$BUILD_TYPE" = "prod" ]; then
    DOCKERFILE="Dockerfile"
    IMAGE_TAG="ng-core:$TAG"
    echo -e "${YELLOW}Using production Dockerfile${NC}"
else
    echo -e "${RED}Unknown build type: $BUILD_TYPE${NC}"
    echo "Usage: ./build-docker.sh [dev|prod] [tag]"
    exit 1
fi

# Build the image
docker build -f "$DOCKERFILE" -t "$IMAGE_TAG" .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully: $IMAGE_TAG${NC}"
else
    echo -e "${RED}✗ Failed to build Docker image${NC}"
    exit 1
fi

# Optional: Push to registry
if [ "$3" = "push" ]; then
    REGISTRY=${4:-docker.io}
    FULL_IMAGE="$REGISTRY/$IMAGE_TAG"
    echo -e "${YELLOW}Pushing image to $REGISTRY...${NC}"
    docker tag "$IMAGE_TAG" "$FULL_IMAGE"
    docker push "$FULL_IMAGE"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Image pushed successfully to $FULL_IMAGE${NC}"
    else
        echo -e "${RED}✗ Failed to push image${NC}"
        exit 1
    fi
fi
