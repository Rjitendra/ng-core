# Docker & Kubernetes Implementation - Complete Setup

This document provides an overview of the complete Docker and Kubernetes implementation for ng-core.

## 📁 Project Structure

```
ng-core/
├── 📄 Dockerfile                      # Production multi-stage image
├── 📄 Dockerfile.dev                  # Development image (with hot reload)
├── 📄 docker-compose.yml              # Local dev environment
├── 📄 docker-compose.prod.yml         # Production-like local setup
├── 📄 nginx.conf                      # Nginx configuration
├── 📄 .dockerignore                   # Docker build exclusions
│
├── 📂 k8s/                            # Kubernetes configurations
│   ├── base/                          # Base manifests (shared)
│   │   ├── namespace.yaml
│   │   ├── serviceaccount.yaml
│   │   ├── configmap.yaml
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── pdb.yaml
│   │   └── kustomization.yaml
│   │
│   ├── local/                         # Local development overlay
│   │   ├── ingress.yaml
│   │   ├── deployment-patch.yaml
│   │   └── kustomization.yaml
│   │
│   └── prod/                          # Production overlay
│       ├── ingress.yaml
│       ├── hpa.yaml
│       ├── network-policy.yaml
│       ├── servicemonitor.yaml
│       ├── deployment-patch.yaml
│       └── kustomization.yaml
│
├── 📂 scripts/                        # Utility scripts
│   ├── build-docker.sh
│   ├── docker-compose-manager.sh
│   ├── k8s-manager.sh
│   └── k8s-local-setup.sh
│
├── 📄 DOCKER_KUBERNETES_GUIDE.md      # Complete technical guide
├── 📄 K8S_DEPLOYMENT.md               # Kubernetes deployment guide
├── 📄 QUICKSTART.md                   # Fast start guide
├── 📄 ENV_VARIABLES.md                # Environment variables reference
└── 📄 README-DOCKER-K8S.md            # This file
```

## 🚀 Quick Start

Choose based on your current need:

### Development (5 seconds)

```bash
docker-compose up
# Access at http://localhost:4200
```

### Local Kubernetes (5 minutes)

```bash
./scripts/k8s-local-setup.sh
# Access at http://ng-core.local
```

### Production (5 steps)

See [Deployment Process](#deployment-process) below

## 📋 What's Included

### Docker Files

| File                      | Purpose                      | Use Case                       |
| ------------------------- | ---------------------------- | ------------------------------ |
| `Dockerfile`              | Multi-stage production build | Container image for production |
| `Dockerfile.dev`          | Development with hot reload  | Local development              |
| `docker-compose.yml`      | Local dev orchestration      | Quick local development setup  |
| `docker-compose.prod.yml` | Production simulation        | Test production locally        |
| `nginx.conf`              | Nginx configuration          | Web server configuration       |

### Kubernetes Manifests

#### Base (k8s/base/)

Shared configuration for all environments:

- Namespace for organization
- Deployment with security best practices
- ClusterIP Service for internal networking
- ConfigMap for environment variables
- ServiceAccount for pod identity
- Pod Disruption Budget for high availability

#### Local Overlay (k8s/local/)

Development environment:

- 1 replica for low resource usage
- Development image tag
- Minimal resource limits
- Local ingress (ng-core.local)
- Debug-level logging

#### Production Overlay (k8s/prod/)

Production environment:

- 3+ replicas with Horizontal Pod Autoscaler
- Production image tag
- Higher resource limits
- TLS-enabled ingress with real domain
- Network policies for security
- Prometheus monitoring integration
- Rate limiting and security headers

### Scripts

| Script                      | Purpose                                |
| --------------------------- | -------------------------------------- |
| `build-docker.sh`           | Build and push Docker images           |
| `docker-compose-manager.sh` | Manage local development environment   |
| `k8s-manager.sh`            | Deploy and manage Kubernetes resources |
| `k8s-local-setup.sh`        | Automated minikube setup               |

### Documentation

| Document                     | Content                                         |
| ---------------------------- | ----------------------------------------------- |
| `DOCKER_KUBERNETES_GUIDE.md` | Comprehensive technical reference (4500+ lines) |
| `K8S_DEPLOYMENT.md`          | Kubernetes deployment detailed guide            |
| `QUICKSTART.md`              | Fast 5-30 second start guides                   |
| `ENV_VARIABLES.md`           | Environment configuration reference             |

## 🎯 Use Cases

### Local Development

**Setup**: Docker Compose
**Time**: ~30 seconds
**Resources**: Low (512MB RAM, 1 CPU)

```bash
docker-compose up
npm run start ng-core  # or access via docker
```

**Features**:

- ✅ Hot module reloading
- ✅ Live code editing
- ✅ Fast startup
- ✅ No infrastructure required
- ✅ Works offline

### Local Kubernetes Testing

**Setup**: Minikube + kubectl + Kustomize
**Time**: ~5 minutes
**Resources**: Medium (8GB RAM, 4 CPU)

```bash
./scripts/k8s-local-setup.sh
```

**Features**:

- ✅ Production-like environment
- ✅ Test networking (ingress, services)
- ✅ Test configurations (ConfigMaps, Secrets)
- ✅ Test security (RBAC, network policies)
- ✅ Test scaling (HPA)

### Production Staging

**Setup**: Docker Compose with prod config
**Time**: ~2 minutes
**Resources**: Medium

```bash
docker-compose -f docker-compose.prod.yml up
```

**Features**:

- ✅ Production image (multi-stage build)
- ✅ Nginx web server
- ✅ Security hardened
- ✅ Gzip compression
- ✅ Health checks

### Production Deployment

**Setup**: Kubernetes cluster (AWS/GCP/Azure/etc)
**Time**: ~15 minutes (after cluster setup)
**Resources**: Variable (scales up/down)

```bash
kubectl apply -k k8s/prod
```

**Features**:

- ✅ High availability (3+ replicas)
- ✅ Auto-scaling (HPA)
- ✅ Load balancing (ingress)
- ✅ HTTPS/TLS (cert-manager)
- ✅ Security policies (network policies, RBAC)
- ✅ Monitoring (Prometheus)
- ✅ Rolling updates (zero-downtime)

## 🏗️ Architecture

### Development Pipeline

```
Source Code
    ↓
Docker Build
    ↓
Development Image (ng-core:dev)
    ↓
Docker Compose / Volume Mounts
    ↓
Angular Dev Server (port 4200)
    ↓
Browser (hot reload)
```

### Production Pipeline

```
Source Code
    ↓
Build & Test
    ↓
Docker Build (Multi-stage)
    ↓
Build Stage: Node.js → Compile Angular
    ↓
Runtime Stage: Nginx → Serve Static Files
    ↓
Production Image (40-50MB)
    ↓
Push to Registry
    ↓
Kubernetes Deployment
    ↓
Rolling Update / Blue-Green Deployment
    ↓
Users Access via Ingress/Load Balancer
```

## 📊 Comparison Matrix

| Feature              | Docker Compose | Minikube K8s | Production K8s |
| -------------------- | -------------- | ------------ | -------------- |
| **Startup Time**     | 10 sec         | 2-5 min      | 5-10 min       |
| **Resource Usage**   | Low            | Medium       | Variable       |
| **Replicas**         | 1              | 1            | 3-10+          |
| **Auto-scaling**     | ❌             | ❌           | ✅ HPA         |
| **Load Balancing**   | ❌             | ✅           | ✅             |
| **TLS/HTTPS**        | ❌             | ⚠️ Optional  | ✅             |
| **Network Policies** | ❌             | ❌           | ✅             |
| **Monitoring**       | ❌             | ❌           | ✅ Prometheus  |
| **Production Ready** | ❌             | ❌           | ✅             |
| **Cost**             | Free           | Free         | $50-500+/month |

## 🔄 Deployment Process

### Local Development Workflow

```
1. docker-compose up
2. Edit code
3. Hot reload (automatic)
4. Test in browser
5. docker-compose down (when done)
```

### Production Deployment Workflow

```
1. Push code to repository
2. CI/CD pipeline triggers
3. Build Docker image
4. Run tests
5. Push image to registry
6. Deploy to Kubernetes
   ├─ Create/update ConfigMaps
   ├─ Update image reference
   ├─ Rolling update starts
   ├─ New pods spin up
   ├─ Traffic shifts gradually
   └─ Old pods terminate
7. Monitor deployment
8. Rollback if needed
```

## 🔐 Security Features

### Docker Security

- ✅ Non-root user (UID 101)
- ✅ Read-only root filesystem
- ✅ No privilege escalation
- ✅ Dropped all capabilities
- ✅ Multi-stage build (minimal image)
- ✅ Security headers (nginx)

### Kubernetes Security

- ✅ Network policies (restrict traffic)
- ✅ RBAC (ServiceAccount with minimal permissions)
- ✅ Resource limits (prevent resource exhaustion)
- ✅ Health checks (liveness, readiness)
- ✅ Security context (non-root, read-only)
- ✅ Pod disruption budgets (availability)
- ✅ Regular updates via rolling deployments

## 📈 Scaling

### Horizontal Scaling (Kubernetes)

Automatic with HPA:

```yaml
minReplicas: 3
maxReplicas: 10
Triggers: CPU 70%, Memory 80%
```

### Vertical Scaling (Kubernetes)

Resource limits adjustable:

```yaml
requests:
  cpu: 200m
  memory: 256Mi
limits:
  cpu: 1000m
  memory: 1Gi
```

### Load Balancing

Automatic via Kubernetes Service and Ingress Controller

## 🛠️ Tools Required

### All Environments

- Docker (19.03+)
- Docker Compose (1.25+)

### Kubernetes (Local/Production)

- kubectl (1.24+)
- kustomize (5.0+) - optional but recommended
- minikube (1.28+) - for local only

### Production Specific

- Kubernetes cluster (EKS, GKE, AKS, etc.)
- Container registry (Docker Hub, ECR, GCR, etc.)
- Domain name and DNS configuration

## 📚 Documentation Structure

```
Quick Overview (This README)
    ↓
├─→ QUICKSTART.md (Fast guides for all scenarios)
│   ├─→ 30-second Docker Compose
│   ├─→ 5-minute Kubernetes local
│   └─→ 5-step production deployment
│
├─→ DOCKER_KUBERNETES_GUIDE.md (Complete technical reference)
│   ├─→ Docker setup & building
│   ├─→ Docker Compose orchestration
│   ├─→ Kubernetes architecture
│   ├─→ Local development workflow
│   ├─→ Production deployment
│   ├─→ CI/CD integration
│   └─→ Troubleshooting
│
├─→ K8S_DEPLOYMENT.md (Kubernetes focus)
│   ├─→ Prerequisites
│   ├─→ Base configuration
│   ├─→ Production overlay
│   ├─→ Deployment process
│   ├─→ Scaling & updates
│   └─→ Debugging
│
└─→ ENV_VARIABLES.md (Configuration reference)
    ├─→ Development variables
    ├─→ Production variables
    └─→ Secret management
```

## ✅ Verification Checklist

### Docker Setup

- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Image builds successfully: `docker build -f Dockerfile -t ng-core:test .`
- [ ] Container runs: `docker run -p 80:80 ng-core:test`

### Kubernetes Setup (Local)

- [ ] kubectl installed: `kubectl version`
- [ ] minikube installed: `minikube version`
- [ ] kustomize installed: `kustomize version` (optional)
- [ ] minikube cluster starts: `minikube start`
- [ ] Deployment creates successfully: `kubectl apply -k k8s/local`
- [ ] Pod is running: `kubectl get pods -n ng-core`

### Kubernetes Setup (Production)

- [ ] kubectl configured: `kubectl cluster-info`
- [ ] Can access cluster: `kubectl get nodes`
- [ ] Image in registry: `docker push your-registry/ng-core:tag`
- [ ] Ingress controller running: `kubectl get pods -n ingress-nginx`
- [ ] DNS configured: `nslookup ng-core.example.com`
- [ ] Deployment successful: `kubectl apply -k k8s/prod`

## 🆘 Common Issues & Solutions

### Docker

**"Port already in use"**

```bash
docker-compose down  # or use -p flag
```

**"Image build fails"**

```bash
docker build --no-cache -f Dockerfile .
```

### Kubernetes

**"Pod not starting"**

```bash
kubectl describe pod <name> -n ng-core
kubectl logs <name> -n ng-core
```

**"Cannot access application"**

```bash
kubectl port-forward svc/ng-core 8080:80 -n ng-core
curl http://localhost:8080
```

**"Ingress not working"**

```bash
kubectl get ingress -n ng-core
kubectl describe ingress ng-core -n ng-core
ping ng-core.local  # or your domain
```

## 🔗 Related Documentation

- [DOCKER_KUBERNETES_GUIDE.md](DOCKER_KUBERNETES_GUIDE.md) - Complete technical guide
- [K8S_DEPLOYMENT.md](K8S_DEPLOYMENT.md) - Kubernetes detailed guide
- [QUICKSTART.md](QUICKSTART.md) - Fast start guides
- [ENV_VARIABLES.md](ENV_VARIABLES.md) - Configuration reference
- [Dockerfile](Dockerfile) - Production image
- [Dockerfile.dev](Dockerfile.dev) - Development image

## 📞 Support

For detailed help, refer to the comprehensive guides above or see Troubleshooting sections in:

- DOCKER_KUBERNETES_GUIDE.md
- K8S_DEPLOYMENT.md
- QUICKSTART.md

## 📝 Next Steps

1. **Choose your use case**: Development, Local Testing, or Production
2. **Read the appropriate quickstart**: QUICKSTART.md
3. **Refer to detailed guides**: DOCKER_KUBERNETES_GUIDE.md or K8S_DEPLOYMENT.md
4. **Deploy**: Follow the deployment process for your chosen environment
5. **Monitor**: Use provided commands to check status and logs

---

**Version**: 1.0  
**Last Updated**: May 28, 2026  
**Docker**: 19.03+  
**Kubernetes**: 1.24+  
**Angular**: 21.2.7  
**Nginx**: Alpine latest
