# Quick Start Guide - Docker & Kubernetes

Fast setup guide to get ng-core running locally and in production.

## 🚀 30-Second Local Setup (Docker Compose)

```bash
# 1. Start development environment
docker-compose up -d

# 2. Access application
open http://localhost:4200

# 3. View logs
docker-compose logs -f ng-core-app

# 4. Stop when done
docker-compose down
```

## 🚀 5-Minute Kubernetes Local Setup (Minikube)

```bash
# 1. Run automated setup
chmod +x scripts/k8s-local-setup.sh
./scripts/k8s-local-setup.sh

# 2. Access application
open http://ng-core.local
# OR
kubectl port-forward -n ng-core svc/ng-core 8080:80
open http://localhost:8080

# 3. View status
./scripts/k8s-manager.sh status local

# 4. View logs
./scripts/k8s-manager.sh logs local
```

## 🚀 Production Deployment (5 Steps)

### Step 1: Build and Push Image

```bash
# Build production image
docker build -f Dockerfile -t your-registry/ng-core:v1.0.0 .

# Login and push
docker login your-registry
docker push your-registry/ng-core:v1.0.0
```

### Step 2: Update Kubernetes Configuration

Edit `k8s/prod/kustomization.yaml`:

```yaml
images:
  - name: ng-core
    newName: your-registry/ng-core
    newTag: v1.0.0
```

### Step 3: Configure Domain

Edit `k8s/prod/ingress.yaml`:

```yaml
hosts:
  - ng-core.example.com # Your domain
```

### Step 4: Deploy

```bash
kubectl apply -k k8s/prod
```

### Step 5: Verify

```bash
kubectl get all -n ng-core
kubectl get ingress -n ng-core
```

## 📊 Comparison: Local vs Production

| Feature        | Docker Compose | Minikube | Production         |
| -------------- | -------------- | -------- | ------------------ |
| Replicas       | 1              | 1        | 3+ (HPA)           |
| Resources      | Low            | Low      | Medium-High        |
| Scaling        | Manual         | Manual   | Automatic (HPA)    |
| Network Policy | No             | Optional | Yes                |
| Monitoring     | No             | No       | Prometheus         |
| Ingress        | Optional       | Enabled  | TLS, Rate limiting |
| Cost           | Free           | Free     | Pay-as-you-go      |

## 🔍 Common Workflows

### Development Workflow (Docker Compose)

```bash
# Start
docker-compose up

# Edit code -> auto-reload at localhost:4200

# Run tests
docker-compose exec ng-core-app npm run test

# Stop
docker-compose down
```

### Local Testing (Kubernetes)

```bash
# Deploy locally
kubectl apply -k k8s/local

# Test
kubectl port-forward -n ng-core svc/ng-core 8080:80

# Make changes and rebuild
eval $(minikube docker-env)
docker build -f Dockerfile -t ng-core:latest .

# Restart pods
kubectl rollout restart deployment/local-ng-core -n ng-core
```

### Production Release

```bash
# Build and push
docker build -f Dockerfile -t registry/ng-core:v1.1.0 .
docker push registry/ng-core:v1.1.0

# Update image in kustomization.yaml
# Then deploy
kubectl apply -k k8s/prod

# Verify
kubectl rollout status deployment/prod-ng-core -n ng-core
```

## 📋 Useful Commands Reference

### Docker

| Command                              | Purpose               |
| ------------------------------------ | --------------------- |
| `docker-compose up`                  | Start dev environment |
| `docker-compose down`                | Stop dev environment  |
| `docker-compose logs -f`             | View logs             |
| `docker build -t ng-core:latest .`   | Build image           |
| `docker run -p 80:80 ng-core:latest` | Run container         |

### Kubernetes

| Command                                               | Purpose           |
| ----------------------------------------------------- | ----------------- |
| `kubectl get pods -n ng-core`                         | List pods         |
| `kubectl logs -f -l app=ng-core -n ng-core`           | View logs         |
| `kubectl port-forward svc/ng-core 8080:80 -n ng-core` | Port forward      |
| `kubectl exec -it <pod> -n ng-core -- sh`             | Shell access      |
| `kubectl apply -k k8s/prod`                           | Deploy            |
| `kubectl delete -k k8s/prod`                          | Remove deployment |

### Scripts

| Script                                | Purpose                |
| ------------------------------------- | ---------------------- |
| `./scripts/build-docker.sh`           | Build Docker image     |
| `./scripts/docker-compose-manager.sh` | Manage Docker Compose  |
| `./scripts/k8s-manager.sh`            | Manage Kubernetes      |
| `./scripts/k8s-local-setup.sh`        | Setup local Kubernetes |

## 🐛 Quick Troubleshooting

### Docker: "Port already in use"

```bash
docker-compose down  # Stop other containers
# Or use different port: docker-compose up -p 8080:4200
```

### Kubernetes: "Pod not starting"

```bash
kubectl describe pod <name> -n ng-core  # Check details
kubectl logs <name> -n ng-core          # Check logs
```

### Minikube: "Cannot access application"

```bash
minikube ip                              # Get IP
curl http://$(minikube ip)               # Test IP
# Or port-forward: kubectl port-forward svc/ng-core 8080:80
```

## 📚 Next Steps

1. **Local Development**: Start with Docker Compose or Minikube
2. **Test Production Setup**: Use `docker-compose.prod.yml` or production Kubernetes overlay
3. **Deploy to Cloud**: Update image registry and domain in `k8s/prod/`
4. **Monitor**: Check Prometheus ServiceMonitor setup for production
5. **CI/CD**: Integrate with GitHub Actions or GitLab CI

For detailed information, see [DOCKER_KUBERNETES_GUIDE.md](DOCKER_KUBERNETES_GUIDE.md)
