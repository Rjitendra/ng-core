# NG-Core Shared Library

A high-quality library of reusable Angular components and utilities built on **Angular Material** and the **CDK**. Optimized for building consistent, accessible line-of-business applications.

[![NPM Version](https://img.shields.io/npm/v/@jitendrabehera/ng-core-controls.svg)](https://www.npmjs.com/package/@jitendrabehera/ng-core-controls)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

To get started, install the package via npm:

```bash
npm install @jitendrabehera/ng-core-controls
```

## Usage

### Minimal Configuration

Import the standalone components you need directly into your Angular component:

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from '@jitendrabehera/ng-core-controls';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<ng-button label="Save" type="filled"></ng-button>`,
})
export class ExampleComponent {}
```

## Developer

**Jitendra**
