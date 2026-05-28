# Docker and Kubernetes Guide for ng-core

Complete documentation for containerizing and orchestrating the ng-core Angular application for both local development and production environments.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Docker Setup](#docker-setup)
3. [Kubernetes Setup](#kubernetes-setup)
4. [Local Development](#local-development)
5. [Production Deployment](#production-deployment)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides containerization and orchestration setup for ng-core using:

- **Docker**: Container images for development and production
- **Docker Compose**: Local development environment orchestration
- **Kubernetes**: Production-ready container orchestration
- **Kustomize**: Environment-specific Kubernetes configurations

### Architecture

```
┌─────────────────────────────────────┐
│     Local Development              │
├─────────────────────────────────────┤
│ Docker Compose (docker-compose.yml) │
│ - Node.js dev server               │
│ - Hot module reloading             │
│ - Volume mounts for live code      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Production Staging               │
├─────────────────────────────────────┤
│ Docker (Dockerfile - multi-stage)  │
│ - Build with Node.js               │
│ - Serve with Nginx                 │
│ - Security hardened                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Kubernetes (Local/Prod)        │
├─────────────────────────────────────┤
│ Local: Minikube with Kustomize     │
│ Prod: Multi-replica, HPA, Ingress  │
│       Network policies, monitoring  │
└─────────────────────────────────────┘
```

---

## Docker Setup

### Directory Structure

```
ng-core/
├── Dockerfile              # Production image (multi-stage)
├── Dockerfile.dev          # Development image
├── docker-compose.yml      # Local dev orchestration
├── docker-compose.prod.yml # Production-like local testing
├── nginx.conf              # Nginx configuration for production
└── scripts/
    └── build-docker.sh     # Build automation script
```

### Dockerfile (Production)

**Location**: `Dockerfile`

Multi-stage build optimizing for production:

```dockerfile
# Stage 1: Build
- Uses Node.js 20-alpine
- Installs dependencies
- Builds Angular app with Nx
- Output: dist/apps/ng-core

# Stage 2: Runtime
- Uses Nginx Alpine (lightweight)
- Non-root user (UID 101)
- Security headers configured
- Gzip compression enabled
- Health check endpoint
- Final image size: ~40-50MB
```

**Features**:

- ✅ Multi-stage build (smaller final image)
- ✅ Non-root user security
- ✅ Health checks
- ✅ Gzip compression
- ✅ Security headers
- ✅ SPA routing support

### Dockerfile.dev (Development)

**Location**: `Dockerfile.dev`

Development-focused image with hot reloading:

```dockerfile
- Node.js 20-alpine
- All dev dependencies installed
- Development server on port 4200
- Volume mount for live code editing
```

### Building Docker Images

#### Using the provided script:

```bash
# Build development image
./scripts/build-docker.sh dev

# Build production image
./scripts/build-docker.sh prod

# Build and push to registry
./scripts/build-docker.sh prod latest push docker.io/yourusername
```

#### Manual build:

```bash
# Development image
docker build -f Dockerfile.dev -t ng-core:dev .

# Production image
docker build -f Dockerfile -t ng-core:latest .

# With tag
docker build -f Dockerfile -t ng-core:v1.0.0 .
```

### Running Docker Images

#### Development:

```bash
# Interactive development
docker run -it --rm \
  -p 4200:4200 \
  -v $(pwd):/app \
  -v /app/node_modules \
  ng-core:dev

# Or with Docker Compose (recommended)
docker-compose up
```

#### Production:

```bash
# Standalone container
docker run -d \
  --name ng-core \
  -p 80:80 \
  --restart unless-stopped \
  ng-core:latest

# Or with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## Docker Compose

### docker-compose.yml (Development)

**Features**:

- Hot module reloading with volume mounts
- Development server on port 4200
- Named volumes for node_modules
- Built-in health checks
- Optional nginx reverse proxy (profiles)

**Commands**:

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f ng-core-app

# Stop environment
docker-compose down

# Clean up volumes
docker-compose down -v

# Using provided script
./scripts/docker-compose-manager.sh up
./scripts/docker-compose-manager.sh logs -f
./scripts/docker-compose-manager.sh down
```

### docker-compose.prod.yml (Production-like)

Test production setup locally:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Kubernetes Setup

### Directory Structure

```
k8s/
├── base/                    # Shared base manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml
│   ├── pdb.yaml             # Pod Disruption Budget
│   └── kustomization.yaml
├── local/                   # Local (minikube) overlay
│   ├── ingress.yaml
│   ├── deployment-patch.yaml
│   ├── kustomization.yaml
│   └── k8s-local-setup.sh
└── prod/                    # Production overlay
    ├── ingress.yaml
    ├── hpa.yaml             # Horizontal Pod Autoscaler
    ├── network-policy.yaml
    ├── servicemonitor.yaml  # Prometheus monitoring
    ├── deployment-patch.yaml
    └── kustomization.yaml
```

### Prerequisites

#### Required Tools:

1. **kubectl** - Kubernetes CLI

   ```bash
   # macOS
   brew install kubectl

   # Windows (via WSL)
   sudo apt-get install kubectl

   # or download from: https://kubernetes.io/docs/tasks/tools/
   ```

2. **Kustomize** - Kubernetes configuration management (optional but recommended)

   ```bash
   # macOS
   brew install kustomize

   # or
   go install sigs.k8s.io/kustomize/kustomize/v5@latest
   ```

3. **Docker** - For building images

#### For Local Development: **Minikube**

```bash
# macOS
brew install minikube

# Windows (via WSL)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### Base Configuration

**Location**: `k8s/base/`

Shared manifests for both environments:

#### namespace.yaml

- Creates `ng-core` namespace
- Organized resource grouping

#### deployment.yaml

- 1 replica (overridden by overlays)
- Container port: 80
- Liveness probe: `/health` endpoint
- Readiness probe: `/health` endpoint
- Security context: non-root user
- Resource requests/limits
- Pod anti-affinity (prefers different nodes)

#### service.yaml

- Type: ClusterIP
- Port: 80
- Service discovery DNS: `ng-core.ng-core.svc.cluster.local`

#### configmap.yaml

- Environment variables
- Overridden by overlays for local/prod

#### pdb.yaml

- Pod Disruption Budget
- Ensures minimum availability during maintenance

---

## Local Development

### Quick Start (Minikube)

**Option 1: Automated Setup**

```bash
chmod +x scripts/k8s-local-setup.sh
./scripts/k8s-local-setup.sh
```

This script:

1. Starts minikube
2. Builds Docker image in minikube
3. Enables ingress controller
4. Adds hostname to `/etc/hosts`
5. Deploys application
6. Waits for pods to be ready

**Option 2: Manual Setup**

```bash
# 1. Start minikube
minikube start --cpus=4 --memory=8192 --driver=docker

# 2. Build Docker image (in minikube's Docker daemon)
eval $(minikube docker-env)
docker build -f Dockerfile -t ng-core:latest .
eval $(minikube docker-env -u)

# 3. Enable ingress addon
minikube addons enable ingress

# 4. Add hostname to /etc/hosts
echo "$(minikube ip) ng-core.local" | sudo tee -a /etc/hosts

# 5. Deploy with kustomize
kubectl apply -k k8s/local

# Or without kustomize
kustomize build k8s/local | kubectl apply -f -

# 6. Wait for pods
kubectl wait --for=condition=ready pod -l app=ng-core -n ng-core --timeout=300s
```

### Access Application

#### Via Ingress (preferred):

```bash
# Once running, access at:
http://ng-core.local
```

#### Via Port Forwarding:

```bash
kubectl port-forward -n ng-core svc/ng-core 8080:80
# Then access at: http://localhost:8080
```

#### Via Node Port (temporary):

```bash
kubectl port-forward -n ng-core pods/<pod-name> 8080:80
```

### Local Development Workflow

```bash
# 1. Start minikube
minikube start

# 2. Evaluate minikube docker env (build in minikube)
eval $(minikube docker-env)

# 3. Rebuild image after code changes
docker build -f Dockerfile -t ng-core:latest .

# 4. Restart pods to use new image
kubectl rollout restart deployment/local-ng-core -n ng-core

# 5. Watch deployment
kubectl rollout status deployment/local-ng-core -n ng-core

# 6. View logs
kubectl logs -f -l app=ng-core -n ng-core

# 7. Exit minikube docker env when done
eval $(minikube docker-env -u)

# 8. Stop minikube (keeps data)
minikube stop

# 9. Delete minikube (clean slate)
minikube delete
```

### Local Overlay Configuration

**File**: `k8s/local/kustomization.yaml`

Configuration for local development:

```yaml
replicas: 1
image tag: dev
resources:
  cpu: 50m (request), 200m (limit)
  memory: 64Mi (request), 256Mi (limit)
environment: development
log level: debug
ingress: ng-core.local
```

### Useful Local Commands

```bash
# Using the management script
./scripts/k8s-manager.sh status local
./scripts/k8s-manager.sh logs local
./scripts/k8s-manager.sh shell local
./scripts/k8s-manager.sh port-forward local

# Manual kubectl commands
kubectl get all -n ng-core
kubectl describe deployment ng-core -n ng-core
kubectl exec -it <pod-name> -n ng-core -- sh
kubectl delete pod <pod-name> -n ng-core  # Force restart

# View events
kubectl get events -n ng-core --sort-by='.lastTimestamp'
```

---

## Production Deployment

### Architecture

```
┌──────────────────────────────────────────┐
│          Load Balancer / Ingress         │
│         (CloudFlare, AWS ELB, etc)       │
└─────────────┬──────────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌────────┐ ┌────────┐ ┌────────┐
│ Pod 1  │ │ Pod 2  │ │ Pod 3  │ ... (min 3)
│(nginx) │ │(nginx) │ │(nginx) │
└────────┘ └────────┘ └────────┘
    │         │         │
    └─────────┼─────────┘
              │
   ┌──────────┴──────────┐
   │   Service (ClusterIP)
   │   Selector: app=ng-core
   │   Port: 80
   └─────────────────────┘

┌──────────────────────────────────┐
│  Horizontal Pod Autoscaler (HPA)  │
│  Min: 3 replicas                  │
│  Max: 10 replicas                 │
│  Scale on: CPU 70%, Memory 80%    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Network Policies                 │
│  - Ingress: ingress-nginx only   │
│  - Egress: DNS, HTTPS allowed    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Monitoring (Prometheus)          │
│  - ServiceMonitor scrapes metrics │
│  - 30s scrape interval            │
└──────────────────────────────────┘
```

### Prerequisites

1. **Production Kubernetes Cluster**:
   - EKS (AWS)
   - GKE (Google Cloud)
   - AKS (Azure)
   - DigitalOcean Kubernetes
   - Or self-managed Kubernetes

2. **Ingress Controller**:

   ```bash
   # nginx-ingress (recommended)
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm install ingress-nginx ingress-nginx/ingress-nginx
   ```

3. **cert-manager** (for HTTPS):

   ```bash
   helm repo add jetstack https://charts.jetstack.io
   helm install cert-manager jetstack/cert-manager --set installCRDs=true
   ```

4. **Container Registry** (Docker Hub, ECR, GCR, etc.)

5. **Domain name** pointing to your ingress controller

### Production Overlay Configuration

**File**: `k8s/prod/kustomization.yaml`

Production-specific settings:

```yaml
replicas: 3 (minimum)
image tag: latest (from registry)
resources:
  cpu: 200m (request), 1000m (limit)
  memory: 256Mi (request), 1Gi (limit)
environment: production
log level: warn
api_base_url: https://ng-core.example.com
```

### Deployment Steps

#### Step 1: Build and Push Docker Image

```bash
# Build image
docker build -f Dockerfile -t your-registry/ng-core:latest .

# Login to registry
docker login your-registry

# Push image
docker push your-registry/ng-core:latest

# Tag version
docker tag your-registry/ng-core:latest your-registry/ng-core:v1.0.0
docker push your-registry/ng-core:v1.0.0
```

#### Step 2: Update Image Reference

Edit `k8s/prod/kustomization.yaml`:

```yaml
images:
  - name: ng-core
    newName: your-registry/ng-core
    newTag: v1.0.0
```

#### Step 3: Configure DNS and Ingress

Edit `k8s/prod/ingress.yaml`:

```yaml
spec:
  tls:
    - hosts:
        - ng-core.example.com # Your domain
      secretName: ng-core-tls
  rules:
    - host: ng-core.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ng-core
                port:
                  number: 80
```

#### Step 4: Deploy

```bash
# Validate manifests
kubectl apply -k k8s/prod --dry-run=client

# Deploy
kubectl apply -k k8s/prod

# Or using kustomize directly
kustomize build k8s/prod | kubectl apply -f -

# Watch rollout
kubectl rollout status deployment/prod-ng-core -n ng-core -w
```

### Production Deployment Verification

```bash
# Check pods
kubectl get pods -n ng-core

# Check deployment
kubectl get deployment -n ng-core

# Check HPA status
kubectl get hpa -n ng-core

# Check ingress
kubectl get ingress -n ng-core

# View all resources
kubectl get all -n ng-core

# Check events for errors
kubectl get events -n ng-core --sort-by='.lastTimestamp'

# View pod details
kubectl describe pod <pod-name> -n ng-core

# View logs
kubectl logs <pod-name> -n ng-core

# Test health endpoint
kubectl port-forward svc/ng-core 8080:80 -n ng-core
curl http://localhost:8080/health
```

### Production Features

#### 1. Horizontal Pod Autoscaler (HPA)

```yaml
minReplicas: 3
maxReplicas: 10
targetCPU: 70%
targetMemory: 80%
```

Usage:

```bash
# Check HPA status
kubectl get hpa -n ng-core

# View detailed HPA info
kubectl describe hpa prod-ng-core -n ng-core

# Manual scaling (testing)
kubectl scale deployment prod-ng-core --replicas=5 -n ng-core
```

#### 2. Network Policies

Restricts traffic:

- **Ingress**: Only from nginx-ingress controller
- **Egress**: DNS queries and HTTPS outbound allowed

```bash
# Verify network policies
kubectl get networkpolicies -n ng-core
kubectl describe networkpolicy prod-ng-core -n ng-core
```

#### 3. Pod Disruption Budgets

Ensures minimum pods available during maintenance:

```bash
kubectl describe pdb -n ng-core
```

#### 4. Monitoring (Prometheus)

ServiceMonitor for Prometheus integration:

```bash
# Check if prometheus-operator is installed
kubectl get crds | grep prometheus

# View ServiceMonitor
kubectl get servicemonitor -n ng-core
```

### Rolling Updates

Update application with zero downtime:

```bash
# Update image
kubectl set image deployment/prod-ng-core \
  ng-core=your-registry/ng-core:v2.0.0 \
  -n ng-core

# Watch rollout
kubectl rollout status deployment/prod-ng-core -n ng-core -w

# Rollback if needed
kubectl rollout undo deployment/prod-ng-core -n ng-core
kubectl rollout history deployment/prod-ng-core -n ng-core
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main
      - develop

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          docker build -f Dockerfile -t ${{ secrets.REGISTRY }}/ng-core:${{ github.sha }} .
          docker tag ${{ secrets.REGISTRY }}/ng-core:${{ github.sha }} ${{ secrets.REGISTRY }}/ng-core:latest

      - name: Push image
        run: |
          docker login -u ${{ secrets.REGISTRY_USERNAME }} -p ${{ secrets.REGISTRY_PASSWORD }}
          docker push ${{ secrets.REGISTRY }}/ng-core:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/ng-core:latest

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/prod-ng-core \
            ng-core=${{ secrets.REGISTRY }}/ng-core:${{ github.sha }} \
            -n ng-core
```

### GitLab CI Example

```yaml
stages:
  - build
  - deploy

build:docker:
  stage: build
  script:
    - docker build -f Dockerfile -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest

deploy:k8s:
  stage: deploy
  script:
    - kubectl set image deployment/prod-ng-core ng-core=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -n ng-core
  only:
    - main
```

---

## Troubleshooting

### Docker Issues

#### Issue: Container exits immediately

```bash
# Check logs
docker logs <container-id>

# Run with keep-alive
docker run -it --entrypoint sh ng-core:latest
```

#### Issue: Port already in use

```bash
# Find process using port
lsof -i :4200  # Linux/macOS
netstat -ano | findstr :4200  # Windows

# Kill process or use different port
docker run -p 8080:4200 ng-core:dev
```

#### Issue: Node modules issues

```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Kubernetes Issues

#### Issue: Pod not starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n ng-core

# Check events
kubectl get events -n ng-core --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n ng-core
```

#### Issue: Image pull backoff

```bash
# Verify image exists in registry
docker pull your-registry/ng-core:tag

# Check imagePullSecrets if using private registry
kubectl describe pod <pod-name> -n ng-core | grep -A 5 "Pull"

# Create secret for private registry
kubectl create secret docker-registry regcred \
  --docker-server=your-registry \
  --docker-username=<username> \
  --docker-password=<password> \
  -n ng-core
```

#### Issue: CrashLoopBackOff

```bash
# Check logs
kubectl logs <pod-name> -n ng-core

# Get previous logs (if available)
kubectl logs <pod-name> -n ng-core --previous

# Increase startup grace period
kubectl patch deployment ng-core -n ng-core --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/livenessProbe/initialDelaySeconds", "value":30}]'
```

#### Issue: Ingress not working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress status
kubectl describe ingress ng-core -n ng-core

# Check DNS
ping ng-core.local  # or your domain

# Verify service
kubectl get svc -n ng-core
```

#### Issue: Health check failing

```bash
# Check if health endpoint exists
kubectl port-forward svc/ng-core 8080:80 -n ng-core
curl http://localhost:8080/health

# Adjust health check timings if needed
kubectl patch deployment ng-core -n ng-core --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/livenessProbe/initialDelaySeconds", "value":30}]'
```

### Minikube Issues

#### Issue: Minikube fails to start

```bash
# Delete and restart
minikube delete
minikube start --cpus=4 --memory=8192 --driver=docker

# Check docker daemon
docker ps  # Verify Docker is running
```

#### Issue: Service not accessible

```bash
# Check minikube IP
minikube ip

# Access via IP directly
curl http://$(minikube ip):30080

# Or use port-forward
kubectl port-forward svc/ng-core 8080:80 -n ng-core
```

### Performance Issues

#### Slow deployment

```bash
# Check resource availability
kubectl top nodes
kubectl top pods -n ng-core

# Check if pods are pending
kubectl get pods -n ng-core -o wide

# Increase resource requests if needed
kubectl set resources deployment ng-core \
  -n ng-core \
  -c ng-core \
  --requests=cpu=500m,memory=512Mi
```

---

## Useful Commands

### Docker

```bash
# Build
docker build -f Dockerfile -t ng-core:latest .

# Run
docker run -d -p 80:80 ng-core:latest

# Logs
docker logs <container-id> -f

# Exec
docker exec -it <container-id> sh

# Cleanup
docker system prune -a --volumes
```

### Docker Compose

```bash
# Start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose build --no-cache
```

### Kubernetes

```bash
# Get resources
kubectl get pods,svc,ingress -n ng-core

# Describe resource
kubectl describe pod <name> -n ng-core

# Logs
kubectl logs <pod> -n ng-core -f

# Execute command
kubectl exec <pod> -n ng-core -- command

# Port forward
kubectl port-forward svc/ng-core 8080:80 -n ng-core

# Apply manifests
kubectl apply -k k8s/prod

# Delete resources
kubectl delete -k k8s/prod

# Watch
kubectl get pods -n ng-core -w
```

### Kustomize

```bash
# Build manifests
kustomize build k8s/prod

# Apply with kustomize
kustomize build k8s/prod | kubectl apply -f -

# Validate
kustomize build k8s/prod | kubectl apply -f - --dry-run=client
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kustomize Documentation](https://kustomize.io/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/)
- [Angular Docker Guide](https://angular.io/guide/deployment)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

## Support and Questions

For issues or questions:

1. Check the Troubleshooting section
2. Review logs: `kubectl logs` or `docker logs`
3. Describe resources: `kubectl describe pod <name>`
4. Check events: `kubectl get events`

Last Updated: 2026-05-28
