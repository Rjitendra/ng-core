#!/bin/bash

# This script manages Kubernetes deployments for ng-core

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
COMMAND=${1:-help}
ENVIRONMENT=${2:-local}

show_help() {
    cat <<EOF
${BLUE}ng-core Kubernetes Manager${NC}

Usage: ./k8s-manager.sh [command] [environment]

Commands:
    deploy          Deploy to Kubernetes
    delete          Delete from Kubernetes
    status          Show deployment status
    logs            Show pod logs
    shell           Open shell in pod
    port-forward    Setup port forwarding
    validate        Validate manifests
    describe        Describe resources
    help            Show this help message

Environments:
    local           Local development (minikube) - default
    prod            Production environment

Examples:
    ./k8s-manager.sh deploy local
    ./k8s-manager.sh delete prod
    ./k8s-manager.sh status local
    ./k8s-manager.sh logs local
    ./k8s-manager.sh port-forward local
EOF
}

# Validate environment
if [ "$ENVIRONMENT" != "local" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo -e "${RED}✗ Invalid environment: $ENVIRONMENT${NC}"
    echo "Valid environments: local, prod"
    exit 1
fi

MANIFEST_PATH="k8s/$ENVIRONMENT"

# Check if manifest path exists
if [ ! -d "$MANIFEST_PATH" ]; then
    echo -e "${RED}✗ Manifest path not found: $MANIFEST_PATH${NC}"
    exit 1
fi

case "$COMMAND" in
    deploy)
        echo -e "${YELLOW}Deploying to Kubernetes ($ENVIRONMENT)...${NC}"
        
        # Check for kubectl
        if ! command -v kubectl &> /dev/null; then
            echo -e "${RED}✗ kubectl not found${NC}"
            exit 1
        fi
        
        # Check for kustomize
        if ! command -v kustomize &> /dev/null; then
            echo -e "${YELLOW}⚠ kustomize not found, using kubectl kustomize${NC}"
            kubectl apply -k "$MANIFEST_PATH"
        else
            kustomize build "$MANIFEST_PATH" | kubectl apply -f -
        fi
        
        echo -e "${GREEN}✓ Deployment complete${NC}"
        echo -e "${BLUE}Run './k8s-manager.sh status $ENVIRONMENT' to check status${NC}"
        ;;
    delete)
        echo -e "${RED}Deleting from Kubernetes ($ENVIRONMENT)...${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kubectl delete -k "$MANIFEST_PATH"
            echo -e "${GREEN}✓ Resources deleted${NC}"
        else
            echo -e "${YELLOW}✗ Cancelled${NC}"
        fi
        ;;
    status)
        echo -e "${BLUE}Deployment Status ($ENVIRONMENT)${NC}"
        echo -e "${YELLOW}Deployment:${NC}"
        kubectl get deployment -n ng-core
        echo -e "\n${YELLOW}Pods:${NC}"
        kubectl get pods -n ng-core
        echo -e "\n${YELLOW}Services:${NC}"
        kubectl get svc -n ng-core
        echo -e "\n${YELLOW}Ingress:${NC}"
        kubectl get ingress -n ng-core
        ;;
    logs)
        POD_NAME=$(kubectl get pods -n ng-core -l app=ng-core -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
        if [ -z "$POD_NAME" ]; then
            echo -e "${RED}✗ No pods found${NC}"
            exit 1
        fi
        echo -e "${YELLOW}Logs from pod: $POD_NAME${NC}"
        kubectl logs -f "$POD_NAME" -n ng-core
        ;;
    shell)
        POD_NAME=$(kubectl get pods -n ng-core -l app=ng-core -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
        if [ -z "$POD_NAME" ]; then
            echo -e "${RED}✗ No pods found${NC}"
            exit 1
        fi
        echo -e "${YELLOW}Opening shell in pod: $POD_NAME${NC}"
        kubectl exec -it "$POD_NAME" -n ng-core -- sh
        ;;
    port-forward)
        echo -e "${YELLOW}Setting up port forwarding ($ENVIRONMENT)...${NC}"
        POD_NAME=$(kubectl get pods -n ng-core -l app=ng-core -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
        if [ -z "$POD_NAME" ]; then
            echo -e "${RED}✗ No pods found${NC}"
            exit 1
        fi
        echo -e "${BLUE}Forwarding localhost:8080 -> pod:80${NC}"
        echo -e "${YELLOW}Access at: http://localhost:8080${NC}"
        kubectl port-forward "$POD_NAME" 8080:80 -n ng-core
        ;;
    validate)
        echo -e "${YELLOW}Validating manifests ($ENVIRONMENT)...${NC}"
        if command -v kustomize &> /dev/null; then
            kustomize build "$MANIFEST_PATH" | kubectl apply -f - --dry-run=client
        else
            kubectl apply -k "$MANIFEST_PATH" --dry-run=client
        fi
        echo -e "${GREEN}✓ Validation successful${NC}"
        ;;
    describe)
        echo -e "${BLUE}Describing resources ($ENVIRONMENT)${NC}"
        kubectl describe all -n ng-core
        ;;
    help|*)
        show_help
        ;;
esac
