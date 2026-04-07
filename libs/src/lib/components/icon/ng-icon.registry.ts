export const MATERIAL_ICON_OPTIONS = [
  'add',
  'add_circle',
  'arrow_back',
  'arrow_forward',
  'bolt',
  'block',
  'check',
  'check_circle',
  'close',
  'delete',
  'download',
  'edit',
  'error',
  'favorite',
  'home',
  'info',
  'inventory_2',
  'open_in_new',
  'publish',
  'rocket_launch',
  'save',
  'schedule',
  'search',
  'settings',
  'shopping_bag',
  'star',
  'sync',
  'upload',
  'visibility',
  'warning',
] as const;

export const CUSTOM_ICON_REGISTRY = {
  sparkle: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/>
    </svg>
  `,
  diamond: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 22 12 12 22 2 12 12 2z"/>
    </svg>
  `,
  upload_badge: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3l5 5h-3v6h-4V8H7l5-5zm-7 13h14v5H5v-5z"/>
    </svg>
  `,
  alert_triangle: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z"/>
    </svg>
  `,
  status_dot: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  `,
} as const;

export const CUSTOM_ICON_OPTIONS = Object.keys(CUSTOM_ICON_REGISTRY);

export type MaterialIconName = (typeof MATERIAL_ICON_OPTIONS)[number];
export type CustomIconName = keyof typeof CUSTOM_ICON_REGISTRY;
