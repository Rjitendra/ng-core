# Docker Run Guide

This guide explains how to run the `ng-core` workspace with Docker Compose.

## Prerequisites

- Docker Desktop or Docker Engine installed
- Docker Compose available as `docker compose`
- Ports `4200`, `4400`, and `80` available when running the matching services

Check your Docker installation:

```bash
docker --version
docker compose version
```

If your machine only has the legacy Compose command, replace `docker compose` with `docker-compose` in the commands below.

## Development App

Start the Angular development server:

```bash
docker compose up -d ng-core-app
```

Open the app:

```text
http://localhost:4200
```

The development container uses `Dockerfile.dev`, mounts the repo into `/app`, and runs:

```bash
npm exec -- nx run ng-core:serve --host=0.0.0.0 --port=4200
```

View logs:

```bash
docker compose logs -f ng-core-app
```

Stop the app:

```bash
docker compose down
```

## Storybook

Start Storybook:

```bash
docker compose up -d ng-core-storybook
```

Open Storybook:

```text
http://localhost:4400
```

View Storybook logs:

```bash
docker compose logs -f ng-core-storybook
```

## Run App And Storybook Together

Start both development services:

```bash
docker compose up -d ng-core-app ng-core-storybook
```

Check running containers:

```bash
docker compose ps
```

## Production-Like Nginx Proxy

The default Compose file includes an optional `nginx-proxy` service behind the `prod-like` profile.

Start the development app with the proxy:

```bash
docker compose --profile prod-like up -d
```

Open the proxy:

```text
http://localhost
```

Stop the profile:

```bash
docker compose --profile prod-like down
```

## Production Build

Build and run the production image from `docker-compose.prod.yml`:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Open the production app:

```text
http://localhost
```

View production logs:

```bash
docker compose -f docker-compose.prod.yml logs -f ng-core-app
```

Stop production:

```bash
docker compose -f docker-compose.prod.yml down
```

## Rebuild Images

Rebuild development images:

```bash
docker compose build
```

Rebuild and restart the development app:

```bash
docker compose up -d --build ng-core-app
```

Build only the production image:

```bash
docker build -f Dockerfile -t ng-core:latest .
```

Build only the development image:

```bash
docker build -f Dockerfile.dev -t ng-core:dev .
```

## Shell Access

Open a shell in the development app container:

```bash
docker compose exec ng-core-app sh
```

Run tests from inside the development app container:

```bash
docker compose exec ng-core-app npm run test
```

## Cleanup

Stop containers:

```bash
docker compose down
```

Stop containers and remove Compose volumes:

```bash
docker compose down -v
```

Remove stopped containers, unused networks, and dangling images:

```bash
docker system prune
```

## Troubleshooting

If port `4200`, `4400`, or `80` is already in use, stop the process using that port or change the port mapping in the matching Compose file.

If dependencies look stale inside the container, rebuild the image:

```bash
docker compose build --no-cache ng-core-app
docker compose up -d ng-core-app
```

If the app container starts but the site is not reachable, inspect status and logs:

```bash
docker compose ps
docker compose logs -f ng-core-app
```

If Docker cannot download dependencies, verify network access and rerun the build:

```bash
docker compose build ng-core-app
```
