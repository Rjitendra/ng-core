# CI/CD Integration Guide

Complete guide for integrating Docker and Kubernetes deployment into CI/CD pipelines.

## Overview

This guide covers integrating ng-core Docker and Kubernetes deployment with popular CI/CD platforms:

- GitHub Actions
- GitLab CI/CD
- Jenkins
- CircleCI
- AWS CodePipeline

## Prerequisites

1. Container registry (Docker Hub, ECR, GCR, etc.)
2. Kubernetes cluster (for production deployments)
3. Registry credentials stored in CI/CD secrets
4. kubectl configuration (for Kubernetes deployments)

## GitHub Actions

### Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy ng-core

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'apps/ng-core/**'
      - 'libs/**'
      - 'Dockerfile'
      - '.github/workflows/deploy.yml'
  pull_request:
    branches:
      - main

env:
  REGISTRY: docker.io
  IMAGE_NAME: ${{ secrets.DOCKER_USERNAME }}/ng-core

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Docker Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: ${{ github.event_name == 'push' }}
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.ref_name }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build Docker image for testing
        if: github.event_name == 'pull_request'
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: false
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:test-${{ github.sha }}
          cache-from: type=gha

  test:
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test ng-core

      - name: Run linting
        run: npm run lint

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'

      - name: Configure kubectl
        run: |
          mkdir -p $HOME/.kube
          echo "${{ secrets.KUBE_CONFIG_STAGING }}" | base64 -d > $HOME/.kube/config
          chmod 600 $HOME/.kube/config

      - name: Update image in Kubernetes
        run: |
          kubectl set image deployment/ng-core \
            ng-core=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n ng-core

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/ng-core -n ng-core

  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'

      - name: Configure kubectl
        run: |
          mkdir -p $HOME/.kube
          echo "${{ secrets.KUBE_CONFIG_PRODUCTION }}" | base64 -d > $HOME/.kube/config
          chmod 600 $HOME/.kube/config

      - name: Update image in Kubernetes
        run: |
          kubectl set image deployment/prod-ng-core \
            ng-core=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n ng-core

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/prod-ng-core -n ng-core

      - name: Verify deployment
        run: |
          kubectl get pods -n ng-core
          kubectl get svc -n ng-core
```

### Required Secrets

In GitHub Settings → Secrets and variables → Actions, add:

```
DOCKER_USERNAME          # Docker Hub username
DOCKER_PASSWORD          # Docker Hub password or token
KUBE_CONFIG_STAGING      # Base64 encoded kubeconfig for staging
KUBE_CONFIG_PRODUCTION   # Base64 encoded kubeconfig for production
```

Create kubeconfig secrets:

```bash
# Encode kubeconfig
cat ~/.kube/config | base64 | tr -d '\n'

# Paste output into GitHub Secrets
```

## GitLab CI/CD

### .gitlab-ci.yml

```yaml
stages:
  - build
  - test
  - deploy-staging
  - deploy-production

variables:
  REGISTRY: $CI_REGISTRY
  IMAGE_NAME: $CI_REGISTRY_IMAGE
  IMAGE_TAG: $CI_COMMIT_SHA

before_script:
  - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

build:docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -f Dockerfile -t $IMAGE_NAME:$IMAGE_TAG -t $IMAGE_NAME:latest .
    - docker push $IMAGE_NAME:$IMAGE_TAG
    - docker push $IMAGE_NAME:latest
  only:
    - main
    - develop
    - merge_requests

test:unit:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm run test ng-core
    - npm run lint
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  cache:
    paths:
      - node_modules/

test:e2e:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm run e2e ng-core-e2e
  cache:
    paths:
      - node_modules/

deploy:staging:
  stage: deploy-staging
  image: bitnami/kubectl:latest
  script:
    - mkdir -p $HOME/.kube
    - echo $KUBE_CONFIG_STAGING | base64 -d > $HOME/.kube/config
    - kubectl set image deployment/ng-core ng-core=$IMAGE_NAME:$IMAGE_TAG -n ng-core
    - kubectl rollout status deployment/ng-core -n ng-core
  environment:
    name: staging
    kubernetes:
      namespace: ng-core
  only:
    - develop

deploy:production:
  stage: deploy-production
  image: bitnami/kubectl:latest
  script:
    - mkdir -p $HOME/.kube
    - echo $KUBE_CONFIG_PRODUCTION | base64 -d > $HOME/.kube/config
    - kubectl set image deployment/prod-ng-core ng-core=$IMAGE_NAME:$IMAGE_TAG -n ng-core
    - kubectl rollout status deployment/prod-ng-core -n ng-core
  environment:
    name: production
    kubernetes:
      namespace: ng-core
  only:
    - main
  when: manual # Require manual approval
```

### Required Variables

In GitLab Settings → CI/CD → Variables, add:

```
KUBE_CONFIG_STAGING      # Base64 encoded kubeconfig
KUBE_CONFIG_PRODUCTION   # Base64 encoded kubeconfig
```

## Jenkins

### Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        REGISTRY = credentials('docker-registry')
        IMAGE_TAG = "${BUILD_ID}"
        KUBE_CONFIG = credentials('kube-config-production')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        docker login -u ${REGISTRY_USR} -p ${REGISTRY_PSW} ${REGISTRY}
                        docker build -f Dockerfile \
                            -t ${REGISTRY}/ng-core:${IMAGE_TAG} \
                            -t ${REGISTRY}/ng-core:latest .
                        docker push ${REGISTRY}/ng-core:${IMAGE_TAG}
                        docker push ${REGISTRY}/ng-core:latest
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                sh '''
                    npm ci
                    npm run test ng-core
                    npm run lint
                '''
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh '''
                        export KUBECONFIG=${KUBE_CONFIG}
                        kubectl set image deployment/ng-core \
                            ng-core=${REGISTRY}/ng-core:${IMAGE_TAG} \
                            -n ng-core
                        kubectl rollout status deployment/ng-core -n ng-core
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input 'Deploy to production?'
                script {
                    sh '''
                        export KUBECONFIG=${KUBE_CONFIG}
                        kubectl set image deployment/prod-ng-core \
                            ng-core=${REGISTRY}/ng-core:${IMAGE_TAG} \
                            -n ng-core
                        kubectl rollout status deployment/prod-ng-core -n ng-core
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
        failure {
            echo 'Pipeline failed!'
            // Send notifications, etc.
        }
    }
}
```

## CircleCI

### .circleci/config.yml

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: cimg/base:current
    steps:
      - checkout
      - setup_remote_docker
      - run:
          name: Build Docker image
          command: |
            docker build -f Dockerfile \
              -t $REGISTRY/ng-core:$CIRCLE_SHA1 \
              -t $REGISTRY/ng-core:latest .
      - run:
          name: Push Docker image
          command: |
            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin $REGISTRY
            docker push $REGISTRY/ng-core:$CIRCLE_SHA1
            docker push $REGISTRY/ng-core:latest

  test:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - restore_cache:
          keys:
            - npm-cache-{{ checksum "package-lock.json" }}
      - run:
          name: Install dependencies
          command: npm ci
      - save_cache:
          paths:
            - node_modules
          key: npm-cache-{{ checksum "package-lock.json" }}
      - run:
          name: Run tests
          command: npm run test ng-core
      - run:
          name: Run linting
          command: npm run lint

  deploy-staging:
    docker:
      - image: cimg/base:current
    steps:
      - checkout
      - run:
          name: Deploy to staging
          command: |
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
            chmod +x kubectl
            mkdir -p $HOME/.kube
            echo "$KUBE_CONFIG_STAGING" | base64 -d > $HOME/.kube/config
            ./kubectl set image deployment/ng-core \
              ng-core=$REGISTRY/ng-core:$CIRCLE_SHA1 \
              -n ng-core
            ./kubectl rollout status deployment/ng-core -n ng-core

  deploy-production:
    docker:
      - image: cimg/base:current
    steps:
      - checkout
      - run:
          name: Deploy to production
          command: |
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
            chmod +x kubectl
            mkdir -p $HOME/.kube
            echo "$KUBE_CONFIG_PRODUCTION" | base64 -d > $HOME/.kube/config
            ./kubectl set image deployment/prod-ng-core \
              ng-core=$REGISTRY/ng-core:$CIRCLE_SHA1 \
              -n ng-core
            ./kubectl rollout status deployment/prod-ng-core -n ng-core

workflows:
  build-and-deploy:
    jobs:
      - build
      - test
      - deploy-staging:
          requires:
            - build
            - test
          filters:
            branches:
              only: develop
      - deploy-production:
          requires:
            - build
            - test
          filters:
            branches:
              only: main
```

## AWS CodePipeline

### buildspec.yml

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/ng-core
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}

  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -f Dockerfile -t $REPOSITORY_URI:latest -t $REPOSITORY_URI:$IMAGE_TAG .
      - npm ci
      - npm run test ng-core
      - npm run lint

  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"ng-core","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
    - k8s/prod/**/*
```

### Pipeline Configuration

```yaml
# In AWS CodePipeline console
Stages: 1. Source (CodeCommit, GitHub)
  2. Build (CodeBuild - runs buildspec.yml)
  3. Deploy (CodeDeploy or ECS/EKS)
```

## General Best Practices

### 1. Container Registry

```yaml
# Use private registry with credentials
- Login before push
- Tag images with commit SHA
- Tag latest for main branch
- Use semantic versioning for releases
```

### 2. Kubernetes Deployment

```yaml
# Use kubectl set image for safe updates
kubectl set image deployment/ng-core \
  ng-core=registry/ng-core:v1.2.3 \
  -n ng-core

# Always verify rollout
kubectl rollout status deployment/ng-core -n ng-core

# Watch for rollback
kubectl rollout undo deployment/ng-core -n ng-core
```

### 3. Environment Secrets

```yaml
# Store in CI/CD secrets, not in code
- Database credentials
- API keys
- SSH keys
- Registry credentials
- kubeconfig files
# Never commit .env files or kubeconfig
```

### 4. Testing

```yaml
# Run tests before deployment
- Unit tests
- Integration tests
- Linting
- Security scanning
- Docker image scanning
```

### 5. Deployment Strategy

```yaml
# Use rolling updates for zero-downtime
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
# Use canary deployments for risk reduction
# Use blue-green deployments for rollback capability
```

### 6. Monitoring

```yaml
# Monitor after deployment
- Check pod status
- Monitor logs
- Check metrics (CPU, memory)
- Monitor ingress/load balancer
- Set up alerts
```

## Rollback Strategy

```yaml
# If deployment fails:
1. Monitor logs: kubectl logs <pod>
2. Check events: kubectl get events -n ng-core
3. Rollback: kubectl rollout undo deployment/ng-core
4. Verify: kubectl rollout status deployment/ng-core
5. Fix issue
6. Retry deployment
```

## Monitoring Deployments

```bash
# Real-time monitoring
kubectl get pods -n ng-core -w

# Check deployment events
kubectl describe deployment ng-core -n ng-core

# Check pod logs
kubectl logs -f <pod-name> -n ng-core

# Check resource usage
kubectl top pods -n ng-core
kubectl top nodes
```

---

Last Updated: 2026-05-28
