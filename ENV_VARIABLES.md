# Environment Variables Configuration

Reference for environment variables used in ng-core across Docker and Kubernetes environments.

## Overview

Environment variables are managed through:

- **Local Development**: Docker Compose environment
- **Docker**: Environment variables passed at runtime
- **Kubernetes**: ConfigMaps and Secrets

## Development Environment (Docker Compose)

File: `docker-compose.yml`

```yaml
environment:
  - NODE_ENV=development
  - NG_HOST=0.0.0.0
```

## Kubernetes ConfigMap

File: `k8s/base/configmap.yaml`

Base configuration applied to all environments:

```yaml
data:
  ENVIRONMENT: 'production'
  API_BASE_URL: ''
  LOG_LEVEL: 'info'
```

### Local Override (Development)

File: `k8s/local/kustomization.yaml`

```yaml
configMapGenerator:
  - name: ng-core-config
    behavior: merge
    literals:
      - ENVIRONMENT=development
      - LOG_LEVEL=debug
```

### Production Override

File: `k8s/prod/kustomization.yaml`

```yaml
configMapGenerator:
  - name: ng-core-config
    behavior: merge
    literals:
      - ENVIRONMENT=production
      - LOG_LEVEL=warn
      - API_BASE_URL=https://ng-core.example.com
```

## Environment Variables Reference

### Application Variables

| Variable       | Type   | Default      | Description                               |
| -------------- | ------ | ------------ | ----------------------------------------- |
| `ENVIRONMENT`  | string | `production` | Environment name (development/production) |
| `NODE_ENV`     | string | `production` | Node.js environment                       |
| `LOG_LEVEL`    | string | `info`       | Logging level (debug/info/warn/error)     |
| `API_BASE_URL` | string | ``           | Backend API base URL                      |
| `NG_HOST`      | string | `0.0.0.0`    | Angular dev server host (dev only)        |

### Network Variables

| Variable   | Type   | Default | Description    |
| ---------- | ------ | ------- | -------------- |
| `PORT`     | number | `80`    | Container port |
| `PROTOCOL` | string | `http`  | HTTP or HTTPS  |

### Feature Flags

Add as needed:

```yaml
- FEATURE_ANALYTICS=true
- FEATURE_BETA=false
- FEATURE_MAINTENANCE_MODE=false
```

### Secrets

For sensitive data, use Kubernetes Secrets:

```bash
# Create secret
kubectl create secret generic ng-core-secrets \
  --from-literal=API_KEY=secret123 \
  --from-literal=DATABASE_URL=postgres://user:pass@host/db \
  -n ng-core

# Reference in deployment patch:
envFrom:
- secretRef:
    name: ng-core-secrets
```

## Configuration Management

### Local Development (Docker Compose)

```yaml
# docker-compose.yml
services:
  ng-core-app:
    environment:
      - NODE_ENV=development
      - LOG_LEVEL=debug
```

### Production (Kubernetes)

```yaml
# k8s/prod/kustomization.yaml
configMapGenerator:
  - name: ng-core-config
    behavior: merge
    literals:
      - ENVIRONMENT=production
      - LOG_LEVEL=warn
      - API_BASE_URL=https://api.example.com
```

### Using .env Files

Create environment-specific files:

```
.env.local          # Development
.env.production     # Production
.env.staging        # Staging
```

Docker support:

```yaml
# docker-compose.yml
env_file:
  - .env.local

# Or command line
docker run --env-file .env.production ng-core:latest
```

## Updating Environment Variables

### Docker Compose

Edit `docker-compose.yml`:

```yaml
services:
  ng-core-app:
    environment:
      - VARIABLE_NAME=value
```

Restart:

```bash
docker-compose down
docker-compose up
```

### Kubernetes (ConfigMap)

Edit `k8s/prod/kustomization.yaml`:

```yaml
configMapGenerator:
  - name: ng-core-config
    behavior: merge
    literals:
      - VARIABLE_NAME=value
```

Redeploy:

```bash
kubectl apply -k k8s/prod
```

### Kubernetes (Secrets)

For sensitive data:

```bash
# Create secret
kubectl create secret generic ng-core-secrets \
  --from-literal=KEY=value \
  -n ng-core

# Update secret
kubectl delete secret ng-core-secrets -n ng-core
kubectl create secret generic ng-core-secrets \
  --from-literal=KEY=newvalue \
  -n ng-core

# Restart pods to pick up new secret
kubectl rollout restart deployment/ng-core -n ng-core
```

## Build-Time vs Runtime Variables

### Build-Time (Angular Compilation)

Environment-specific code loaded during build:

```bash
# Development build
ng build --configuration development

# Production build
ng build --configuration production
```

### Runtime (Container Environment)

Set after container starts, accessible to application:

```bash
docker run -e API_BASE_URL=https://api.example.com ng-core:latest
```

## Security Best Practices

1. **Never commit secrets to git**

   ```bash
   # Add to .gitignore
   .env.local
   .env.production
   secrets/
   ```

2. **Use Kubernetes Secrets for sensitive data**

   ```bash
   # Bad: ConfigMap
   configMapGenerator:
   - literals:
     - DATABASE_PASSWORD=secret123  # Don't do this!

   # Good: Kubernetes Secret
   kubectl create secret generic ng-core-secrets \
     --from-literal=DATABASE_PASSWORD=secret123
   ```

3. **Use external secret management**
   - HashiCorp Vault
   - AWS Secrets Manager
   - Google Secret Manager
   - Azure Key Vault

4. **Limit environment variable exposure**

   ```yaml
   # Only pass needed variables
   envFrom:
     - configMapRef:
         name: ng-core-config
   # Not env with hardcoded values
   ```

5. **Rotate secrets regularly**

   ```bash
   # Update secret
   kubectl delete secret ng-core-secrets -n ng-core
   kubectl create secret generic ng-core-secrets \
     --from-literal=DATABASE_PASSWORD=newsecret456

   # Restart pods
   kubectl rollout restart deployment/ng-core -n ng-core
   ```

## Debugging Environment Variables

### View configured variables

```bash
# Docker Compose
docker-compose config | grep environment

# Kubernetes ConfigMap
kubectl get configmap ng-core-config -n ng-core -o yaml

# In running pod
kubectl exec <pod-name> -n ng-core -- printenv | sort
```

### Verify variables are set

```bash
# In pod shell
kubectl exec -it <pod-name> -n ng-core -- sh
printenv | grep VARIABLE_NAME
```

### Check mounted volumes

```bash
# If using configmap as file
kubectl exec <pod-name> -n ng-core -- ls -la /etc/config/
kubectl exec <pod-name> -n ng-core -- cat /etc/config/filename
```

---

Last Updated: 2026-05-28
