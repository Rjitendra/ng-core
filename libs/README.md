# @ng-core/shared

Angular **standalone** components and `SharedControlsModule` built on **Angular Material** and the **CDK**.

## Documentation

- [Controls catalog (grouped inventory, roadmap, naming)](../docs/CONTROLS-CATALOG.md)

## Install (from npm, after publish)

```bash
npm install @ng-core/shared
```

Peer dependencies: Angular 21+, Angular Material, CDK, RxJS (see `package.json`).

## Install (from monorepo / path)

Point your app at the built output or use your workspace linker (Nx, npm `file:`, etc.).

## Build

From repository root:

```bash
npx nx run shared:build
```

Published artifacts are emitted to `dist/libs/` (ng-packagr).
