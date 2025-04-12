export const TICKET_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

export const STATUS_LABELS: Record<string, string> = {
  [TICKET_STATUS.NEW]: 'New',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.COMPLETED]: 'Completed'
};

export const STATUS_COLORS: Record<string, string> = {
  [TICKET_STATUS.NEW]: 'info',
  [TICKET_STATUS.IN_PROGRESS]: 'warning',
  [TICKET_STATUS.COMPLETED]: 'success',
  default: 'default'
};

export const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency', 
  currency: 'AUD'
};

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};