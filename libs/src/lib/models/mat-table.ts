import { TemplateRef } from '@angular/core';

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
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  iconClass?: string;
  iconColor?: string;
}

export interface TableOptions {
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
}
