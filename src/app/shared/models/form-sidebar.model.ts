export interface FormSidebarTip {
  icon: string;
  description: string;
  type?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'brand';
}

export interface FormSidebarInfo {
  label: string;
  value: string | number;
  isBadge?: boolean;
  badgeClass?: string;
  valueClass?: string;
}
