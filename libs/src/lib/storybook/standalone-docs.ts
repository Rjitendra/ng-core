type StorybookDocsParameters = {
  controls?: {
    expanded?: boolean;
  };
  layout?: 'centered' | 'fullscreen' | 'padded';
  docs?: {
    description?: {
      component?: string;
    };
    source?: {
      code?: string;
      type?: 'auto' | 'code' | 'dynamic';
    };
  };
};

type StandaloneDocsOptions = {
  packageName?: string;
  selector?: string;
  symbols?: string[];
  template?: string;
  note?: string;
};

type AngularDefinition = {
  selectors?: string[][] | undefined;
};

const DEFAULT_PACKAGE_NAME = '@jitendrabehera/ng-core-controls';

function selectorFromComponent(component: unknown): string | undefined {
  const angularComponent = component as {
    ɵcmp?: AngularDefinition;
    ɵdir?: AngularDefinition;
  };

  return angularComponent.ɵcmp?.selectors?.[0]?.[0] ?? angularComponent.ɵdir?.selectors?.[0]?.[0];
}

function templateFromSelector(selector: string): string {
  if (selector.startsWith('[') && selector.endsWith(']')) {
    return `<div ${selector.slice(1, -1)}></div>`;
  }

  return `<${selector}></${selector}>`;
}

function buildSource(
  symbolNames: string[],
  selector: string | undefined,
  packageName: string,
  template?: string,
): string {
  const imports = symbolNames.join(', ');
  const exampleTemplate = template ?? (selector ? templateFromSelector(selector) : '<!-- Add your markup here -->');

  return `import { Component } from '@angular/core';
import { ${imports} } from '${packageName}';

@Component({
  standalone: true,
  imports: [${imports}],
  template: \`${exampleTemplate}\`,
})
export class ExampleComponent {}`;
}

export function withControlDocs(
  component: unknown,
  baseParameters: StorybookDocsParameters = {},
  options: StandaloneDocsOptions = {},
): StorybookDocsParameters {
  const packageName = options.packageName ?? DEFAULT_PACKAGE_NAME;
  const symbolNames = options.symbols ?? [((component as { name?: string }).name || 'YourComponent')];
  const selector = options.selector ?? selectorFromComponent(component);
  const source = buildSource(symbolNames, selector, packageName, options.template);

  const descriptionLines = [
    'Every control in this library is standalone.',
    '',
    'Install:',
    `\`npm install ${packageName}\``,
    '',
    'Import only the controls you use:',
    '',
    '```ts',
    source,
    '```',
  ];

  if (options.note) {
    descriptionLines.push('', options.note);
  }

  return {
    ...baseParameters,
    docs: {
      ...baseParameters.docs,
      description: {
        ...baseParameters.docs?.description,
        component: descriptionLines.join('\n'),
      },
    },
  };
}
