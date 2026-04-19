export interface LayoutNavItem {
  name?: string;
  url?: string;
  icon?: string;
  expanded?: boolean;
  children?: LayoutNavItem[];
}
