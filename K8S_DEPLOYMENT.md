# Kubernetes Deployment Guide

Complete reference for deploying ng-core to production Kubernetes clusters.

## Prerequisites

### Required

- Kubernetes 1.24+ cluster (EKS, GKE, AKS, or self-managed)
- `kubectl` configured for your cluster
- Docker image pushed to accessible registry
- `kustomize` v5+ (optional, for configuration management)

### Recommended

- Ingress controller (nginx-ingress recommended)
- cert-manager (for TLS certificates)
- Prometheus for monitoring
- Persistent storage (for future enhancements)

## Deployment Architecture

### Network Topology

```
                    ┌─────────────────┐
                    │ External Traffic│
                    └────────┬────────┘
                             │
            ┌────────────────┴─────────────────┐
            │                                  │
        ┌───────────────────────┐   ┌─────────────────────┐
        │ Ingress Controller    │   │ Load Balancer       │
        │ (nginx-ingress)       │   │ Service             │
        └───────┬───────────────┘   └──────────┬──────────┘
                │                              │
    ┌───────────┼──────────────┬───────────────┼──────────────┐
    │           │              │               │              │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐        ┌──────▼──────┐
│ Pod 1 │  │ Pod 2 │  │ Pod 3 │  ...   │  NodePort   │
│(nginx)│  │(nginx)│  │(nginx)│        │  Service    │
└───┬───┘  └───┬───┘  └───┬───┘        └─────────────┘
    │           │          │
    └───────────┼──────────┘
                │
        ┌───────▼────────┐
        │  ClusterIP     │
        │  Service       │
        │  (Selector:    │
        │   app=ng-core) │
        └────────────────┘
```

## Base Configuration (k8s/base)

Common configuration for all environments.

### Namespace

Creates `ng-core` namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ng-core
```

### Service Account

Required for pod identity:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ng-core
  namespace: ng-core
```

### ConfigMap

Environment variables:

```yaml
data:
  ENVIRONMENT: 'production'
  LOG_LEVEL: 'info'
  API_BASE_URL: '' # Override in overlays
```

### Deployment

Core application deployment:

```yaml
spec:
  replicas: 1 # Override in overlays
  containers:
    - name: ng-core
      image: ng-core:latest
      ports:
        - containerPort: 80
      livenessProbe:
        httpGet:
          path: /health
          port: 80
        initialDelaySeconds: 10
        periodSeconds: 30
      readinessProbe:
        httpGet:
          path: /health
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 10
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 500m
          memory: 512Mi
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

### Service

Network exposure:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ng-core
  namespace: ng-core
spec:
  type: ClusterIP # Internal service
  selector:
    app: ng-core
  ports:
    - port: 80
      targetPort: 80
```

### Pod Disruption Budget

Availability guarantee:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ng-core
  namespace: ng-core
spec:
  minAvailable: 1 # Minimum pods running during maintenance
  selector:
    matchLabels:
      app: ng-core
```

## Production Overlay (k8s/prod)

Production-specific enhancements.

### Configuration

```yaml
replicas: 3
image: your-registry/ng-core:v1.0.0
resources:
  requests:
    cpu: 200m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 1Gi
environment: production
logLevel: warn
apiBaseUrl: https://ng-core.example.com
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ng-core
  annotations:
    cert-manager.io/cluster-issuer: 'letsencrypt-prod'
    nginx.ingress.kubernetes.io/rate-limit: '100'
spec:
  tls:
    - hosts:
        - ng-core.example.com
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

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ng-core
  namespace: ng-core
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ng-core
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### Network Policy

Restrict traffic:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ng-core
  namespace: ng-core
spec:
  podSelector:
    matchLabels:
      app: ng-core
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 80
  egress:
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: TCP
          port: 53 # DNS
        - protocol: UDP
          port: 53
    - to:
        - podSelector: {}
      ports:
        - protocol: TCP
          port: 443 # HTTPS
```

## Pre-Deployment Checklist

- [ ] Kubernetes cluster provisioned and accessible via `kubectl`
- [ ] `kubectl` context pointing to correct cluster
- [ ] Ingress controller installed
- [ ] cert-manager installed (for HTTPS)
- [ ] Docker image built and pushed to registry
- [ ] Domain configured and DNS pointing to ingress IP
- [ ] Image registry credentials configured (if private)
- [ ] Monitoring setup ready (optional)

## Deployment Process

### 1. Configure Image Registry

Edit `k8s/prod/kustomization.yaml`:

```yaml
images:
  - name: ng-core
    newName: your-registry.com/ng-core
    newTag: v1.0.0
```

### 2. Configure Domain

Edit `k8s/prod/ingress.yaml`:

```yaml
spec:
  tls:
    - hosts:
        - ng-core.example.com
      secretName: ng-core-tls
  rules:
    - host: ng-core.example.com
```

### 3. Configure Environment Variables

Edit `k8s/prod/kustomization.yaml`:

```yaml
configMapGenerator:
  - name: ng-core-config
    literals:
      - ENVIRONMENT=production
      - LOG_LEVEL=info
      - API_BASE_URL=https://ng-core.example.com
```

### 4. Validate Configuration

```bash
kustomize build k8s/prod
# or
kustomize build k8s/prod | kubectl apply -f - --dry-run=client
```

### 5. Deploy

```bash
kubectl apply -k k8s/prod
```

### 6. Monitor Deployment

```bash
# Watch rollout
kubectl rollout status deployment/prod-ng-core -n ng-core -w

# Check pods
kubectl get pods -n ng-core -w

# Check ingress
kubectl get ingress -n ng-core -w

# After ingress IP appears, update DNS:
# Point ng-core.example.com to the ingress IP
```

## Post-Deployment Verification

### 1. Pod Status

```bash
kubectl get pods -n ng-core

# All pods should be Running and Ready (2/2)
```

### 2. Service Status

```bash
kubectl get svc -n ng-core
kubectl get svc ng-core -n ng-core -o wide
```

### 3. Ingress Status

```bash
kubectl get ingress -n ng-core
kubectl describe ingress ng-core -n ng-core

# Check if IP/hostname is assigned
```

### 4. Application Health

```bash
# Port forward to test
kubectl port-forward svc/ng-core 8080:80 -n ng-core

# In another terminal
curl http://localhost:8080/health
```

### 5. DNS Resolution

```bash
# Wait for DNS to propagate (up to 48 hours)
nslookup ng-core.example.com
dig ng-core.example.com
```

### 6. HTTPS Certificate

```bash
# If using cert-manager
kubectl get certificate -n ng-core
kubectl describe certificate ng-core -n ng-core

# Test HTTPS
curl -I https://ng-core.example.com
```

## Scaling

### Automatic Scaling (HPA)

Configured by default in production:

```bash
# Check HPA status
kubectl get hpa -n ng-core
kubectl describe hpa prod-ng-core -n ng-core

# Monitor scaling events
kubectl get events -n ng-core --sort-by='.lastTimestamp' | grep HPA
```

### Manual Scaling

```bash
# Scale to specific replicas
kubectl scale deployment prod-ng-core --replicas=5 -n ng-core

# Edit deployment directly
kubectl edit deployment prod-ng-core -n ng-core
```

### Monitor Metrics

```bash
# CPU and memory usage
kubectl top pods -n ng-core
kubectl top nodes

# If metrics-server not installed
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## Updates and Rollouts

### Rolling Update

Zero-downtime updates:

```bash
# Update image
kubectl set image deployment/prod-ng-core \
  ng-core=your-registry/ng-core:v1.1.0 \
  -n ng-core

# Watch progress
kubectl rollout status deployment/prod-ng-core -n ng-core -w

# Check history
kubectl rollout history deployment/prod-ng-core -n ng-core
```

### Rollback

If update fails:

```bash
# Rollback to previous version
kubectl rollout undo deployment/prod-ng-core -n ng-core

# Rollback to specific revision
kubectl rollout undo deployment/prod-ng-core --to-revision=2 -n ng-core
```

## Debugging

### Pod Logs

```bash
# Recent logs
kubectl logs <pod-name> -n ng-core

# Follow logs
kubectl logs -f <pod-name> -n ng-core

# Previous logs (if crashed)
kubectl logs <pod-name> -n ng-core --previous

# All pods
kubectl logs -l app=ng-core -n ng-core -f
```

### Pod Details

```bash
# Describe pod
kubectl describe pod <pod-name> -n ng-core

# Get pod YAML
kubectl get pod <pod-name> -n ng-core -o yaml

# Pod events
kubectl get events -n ng-core --sort-by='.lastTimestamp'
```

### Exec into Pod

```bash
# Open shell
kubectl exec -it <pod-name> -n ng-core -- sh

# Run command
kubectl exec <pod-name> -n ng-core -- curl http://localhost/health
```

### Network Troubleshooting

```bash
# DNS resolution
kubectl exec <pod-name> -n ng-core -- nslookup kubernetes.default

# Service connectivity
kubectl exec <pod-name> -n ng-core -- wget -O- http://ng-core/health

# Port forward for testing
kubectl port-forward svc/ng-core 8080:80 -n ng-core
```

## Monitoring and Logging

### Prometheus Monitoring

ServiceMonitor is configured for Prometheus:

```bash
# Check if prometheus-operator is installed
kubectl get crds | grep prometheus

# View ServiceMonitor
kubectl get servicemonitor -n ng-core
kubectl describe servicemonitor prod-ng-core -n ng-core
```

### Application Logs

```bash
# View all logs
kubectl logs -l app=ng-core -n ng-core -f

# Filter by pod
kubectl logs pod/prod-ng-core-xyz -n ng-core

# Previous crash logs
kubectl logs pod/prod-ng-core-xyz -n ng-core --previous
```

### Cluster Logs

```bash
# System pods
kubectl logs -n kube-system <pod-name>

# Ingress controller
kubectl logs -n ingress-nginx <pod-name>

# Cert-manager
kubectl logs -n cert-manager <pod-name>
```

## Backup and Disaster Recovery

### Backup Manifests

```bash
# Export current configuration
kubectl get all -n ng-core -o yaml > backup-ng-core.yaml

# Export kustomize manifests
kustomize build k8s/prod > manifest.yaml
```

### Restore from Backup

```bash
# Restore from exported YAML
kubectl apply -f backup-ng-core.yaml

# Or reapply kustomize
kubectl apply -k k8s/prod
```

## Cleanup

### Remove Single Resource

```bash
kubectl delete pod <pod-name> -n ng-core
kubectl delete deployment prod-ng-core -n ng-core
```

### Remove All Resources

```bash
# Delete via kustomize
kubectl delete -k k8s/prod

# Or individual components
kubectl delete deployment,service,ingress -l app=ng-core -n ng-core

# Delete namespace (removes everything in it)
kubectl delete namespace ng-core
```

## Useful References

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Deployment Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Ingress Documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- [HorizontalPodAutoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)

---

Last Updated: 2026-05-28
