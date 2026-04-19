# Shared controls catalog

This document groups every control exported from `@ng-core/shared`, suggests where to deepen features, lists common gaps, and aligns **realistic naming** with what ships in code today.

## 1. Feedback and status

| Export (class) | Selector | Role |
|----------------|----------|------|
| `AlertComponent` | `ng-alert` | Inline / page alerts |
| `AlertMessageComponent` | `ng-alert-message` | Compact alert line |
| `NgErrorComponent` | `ng-error` | Form field errors |
| `SpinnerComponent` | `ng-spinner` | Inline / blocking spinner |
| `NgLoadingOverlayComponent` | `ng-loading-overlay` | Fullscreen / keyed overlay |

**Improvements:** unify loading UX (`SpinnerComponent` vs overlay + `LoadingService`); optional toast / snack-bar wrapper; i18n strings for `LiveAnnouncer` in tables.

## 2. Layout and navigation

| Export | Selector | Role |
|--------|----------|------|
| `NgLayoutComponent` | `ng-layout` | App shell (toolbar, sidenav, router-outlet) |
| `NgAccordionComponent` | `ng-accordion` | Expandable sections |
| `NgMenuComponent` | `ng-menu` | Overlay menu panel |
| `NgMenuItemDirective` | `[ng-menu-item]` | Menu row semantics |
| `NgMenuTriggerForDirective` | `[ngMenuTriggerFor]` | Opens `NgMenuComponent` |
| `NgTreeComponent` | `ng-tree` | Hierarchical data |

**Improvements:** `NgLayoutComponent` — optional breadcrumbs, mobile drawer mode, a11y audit on nested menus; `NgMenu*` — focus trap and Escape-to-close (overlay already closes on backdrop click).

## 3. Surfaces (cards, tiles, chrome)

| Export | Selector | Role |
|--------|----------|------|
| `NgCardComponent` | `ng-card` | Standard card |
| `NgAdvancedCardComponent` | `ng-advanced-card` | Card + actions + footer |
| `NgTileComponent` | `ng-tile` | Metric / KPI tile |
| `NgBadgeComponent` | `ng-badge` | Pill / status badge |
| `NgDividerComponent` | `ng-divider` | Horizontal / vertical divider |

**Improvements:** advanced card — loading state on actions; tile — chart slot or trend indicator.

## 4. Form primitives (single controls)

| Export | Selector | Role |
|--------|----------|------|
| `NgLabelComponent` | `ng-label` | Label + hint + required |
| `NgClarifyTextComponent` | `ng-clarify-text` | Help popover trigger |
| `NgFormFieldComponent` | `ng-form-field` | Slot-based field wrapper |
| `NgTextboxComponent` | `ng-textbox` | Text / textarea-capable input (CVA) |
| `NgTextareaComponent` | `ng-textarea` | Multiline + autosize (CVA) |
| `NgInputComponent` | `ng-input` | Mat input + validation helpers (CVA) |
| `NgCheckboxComponent` | `ng-checkbox` | Checkbox / toggle mode (CVA) |
| `NgToggleComponent` | `ng-toggle` | Slide toggle (CVA) |
| `NgToggleButtonComponent` | `ng-toggle-button` | Button toggle group (CVA) |
| `NgRadioGroupComponent` | `ng-radio-group` | Radio group (CVA) |
| `NgSliderComponent` | `ng-slider` | Slider (CVA) |
| `NgDatepickerComponent` | `ng-datepicker` | Date / range (CVA) |
| `NgChipsComponent` | `ng-chips` | Chip input list |
| `NgAutocompleteComponent` | `ng-autocomplete` | Autocomplete (CVA) |
| `NgSelectComponent` | `ng-select` | Mat select wrapper (CVA) |
| `NgDropdownComponent` | `ng-dropdown` | Rich select (search, groups, multi) (CVA) |
| `NgFileUploadComponent` | `ng-file-upload` | File list + drag-drop (CVA) |

**Improvements:** align `NgSelect` vs `NgDropdown` docs (when to use which); shared `showError` / touched pattern across all CVA controls; optional `NgErrorComponent` integration on `NgInput` / `NgTextarea`.

## 5. Data display

| Export | Selector | Role |
|--------|----------|------|
| `NgMatTableComponent` | `ng-mat-table` | Sortable table, selection, expand |
| `NgProgressBarComponent` | `ng-progress-bar` | Determinate / indeterminate bar |

**Improvements:** table — column resize, virtual scroll hook, server-side sort contract; progress — stacked segments.

## 6. Actions and dialogs

| Export | Selector | Role |
|--------|----------|------|
| `ButtonComponent` | `ng-button` | Primary actions |
| `NgDialogComponent` | `ng-dialog` | Dialog shell |
| Dialog services | — | `DialogService`, Material bridge |

**Improvements:** document `buttonClick` vs native `submit`; confirm / destructive presets.

## 7. Icons

| Export | Selector | Role |
|--------|----------|------|
| `IconComponent` | `ng-icon` | Material + registry SVG |
| `CUSTOM_ICON_REGISTRY` | — | Custom SVG map |

---

## Naming: realistic and consistent

- **Selectors** use the `ng-*` prefix (Angular style, short, stable in templates).
- **Classes** today mix `Ng*` (most) with `AlertComponent` / `ButtonComponent` (older). **Recommendation for new work:** prefer `Ng*` + domain, e.g. `NgDataTableComponent` (if you ever rename `NgMatTableComponent`, do it with a deprecation alias export for one major).
- **Package name:** published npm name is `@ng-core/shared` (see `libs/package.json`). For a more **product-realistic** public name on npm, consider a scoped name under your org, e.g. `@your-org/angular-controls`, and treat `@ng-core/shared` as an internal alias—only change after a semver major and changelog.

---

## Likely missing controls (add when you need them)

| Control | Why |
|---------|-----|
| **Snackbar / toast** | Global non-blocking feedback |
| **Tooltip directive** (wrapper) | Consistent delay / template API on top of CDK/Material |
| **Skeleton / shimmer** | Loading placeholders for cards and table rows |
| **Empty state** | Illustration + CTA when lists/tables have no data |
| **Pagination bar** (non-Material-table) | Simple “page X of Y” for custom lists |
| **Search / filter bar** | Composed pattern (input + chips + clear) |
| **Color / theme picker** | If you ship white-label tenants |
| **Time picker / datetime** | If datepicker alone is not enough |
| **Rating** | Reviews / satisfaction |
| **Code editor** | Only if product needs in-browser snippets |

---

## Hosting

- **npm:** see root `README.md` section *Publishing `@ng-core/shared` to npm* and workflow `.github/workflows/npm-publish.yml`.
- **GitHub static (Storybook):** workflow `.github/workflows/storybook-github-pages.yml` builds Storybook and pushes to branch `gh-pages`. Enable **Pages → Deploy from branch → gh-pages / root** in the repository settings.
