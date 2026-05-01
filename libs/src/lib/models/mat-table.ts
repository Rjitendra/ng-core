import { TemplateRef } from '@angular/core';
import { IconTone } from '../components/icon/ng-icon.component';

export type TableCellType = 'text' | 'link' | 'custom' | 'checkbox';

export interface TableColumn {
  key: string;
  label: string;
  type?: TableCellType;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  color?: string;
  sortable?: boolean;
  template?: TemplateRef<unknown>;
  visible?: boolean;
  sticky?: boolean;
  headerTemplate?: TemplateRef<unknown>;
  className?: string;
  wrapText?: boolean;
  truncateText?: boolean;
  hidden?: boolean;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  iconClass?: string;
  iconColor?: string;
}

export interface TableAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'text' | 'outlined' | 'filled' | 'tonal' | 'icon';
  tone?: IconTone;
}

export interface TableStat {
  label: string;
  value: string;
  tone?: IconTone;
}

export interface TableOptions {
  title?: string;
  subtitle?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  serverSide?: boolean;
  sortable?: boolean;
  showCheckbox?: boolean;
  multiSelect?: boolean;
  responsive?: boolean;
  autoWidth?: boolean;
  fixedLayout?: boolean;
  stickyHeader?: boolean;
  stickyPaginator?: boolean;
  showToolbar?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  showColumnManager?: boolean;
  dense?: boolean;
  stripedRows?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  rowActions?: TableAction[];
  stats?: TableStat[];
}
