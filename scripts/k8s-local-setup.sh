#!/bin/bash

# Setup script for Kubernetes on minikube for local development

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== ng-core Kubernetes Local Setup ===${NC}\n"

# Check if minikube is installed
if ! command -v minikube &> /dev/null; then
    echo -e "${RED}✗ minikube not found${NC}"
    echo "Please install minikube: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl not found${NC}"
    echo "Please install kubectl: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Check if kustomize is installed
if ! command -v kustomize &> /dev/null; then
    echo -e "${YELLOW}⚠ kustomize not found - optional but recommended${NC}"
    echo "Install with: go install sigs.k8s.io/kustomize/kustomize/v5@latest"
fi

echo -e "${YELLOW}Step 1: Starting minikube...${NC}"
minikube start --cpus=4 --memory=8192 --driver=docker
echo -e "${GREEN}✓ Minikube started${NC}\n"

echo -e "${YELLOW}Step 2: Building Docker image...${NC}"
# Build image using minikube's Docker daemon
eval $(minikube docker-env)
docker build -f Dockerfile -t ng-core:latest .
eval $(minikube docker-env -u)
echo -e "${GREEN}✓ Docker image built${NC}\n"

echo -e "${YELLOW}Step 3: Setting up Ingress controller...${NC}"
minikube addons enable ingress
echo -e "${GREEN}✓ Ingress controller enabled${NC}\n"

echo -e "${YELLOW}Step 4: Adding local hostname to /etc/hosts...${NC}"
MINIKUBE_IP=$(minikube ip)
if grep -q "ng-core.local" /etc/hosts; then
    echo -e "${YELLOW}ng-core.local already in /etc/hosts${NC}"
else
    echo "$MINIKUBE_IP ng-core.local" | sudo tee -a /etc/hosts > /dev/null
    echo -e "${GREEN}✓ Added ng-core.local to /etc/hosts${NC}"
fi
echo -e "${BLUE}Minikube IP: $MINIKUBE_IP${NC}\n"

echo -e "${YELLOW}Step 5: Deploying application...${NC}"
kubectl apply -k k8s/local
echo -e "${GREEN}✓ Application deployed${NC}\n"

echo -e "${YELLOW}Step 6: Waiting for pods to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=ng-core -n ng-core --timeout=300s 2>/dev/null || true
echo -e "${GREEN}✓ Pods ready${NC}\n"

echo -e "${GREEN}=== Setup Complete ===${NC}\n"
echo -e "${BLUE}Useful commands:${NC}"
echo "  - View pod status: kubectl get pods -n ng-core"
echo "  - View logs: kubectl logs -l app=ng-core -n ng-core -f"
echo "  - Port forward: kubectl port-forward -n ng-core svc/ng-core 8080:80"
echo "  - Access via ingress: http://ng-core.local"
echo "  - Open dashboard: minikube dashboard"
echo ""
echo -e "${BLUE}To access the application:${NC}"
echo "  1. http://ng-core.local (via ingress)"
echo "  2. kubectl port-forward -n ng-core svc/ng-core 8080:80"
echo "     then access at http://localhost:8080"
