import { STATUS_COLORS, STATUS_LABELS, CURRENCY_FORMAT_OPTIONS, DATE_FORMAT_OPTIONS } from '../constants/ticketConstants';

export const getStatusColor = (status: string) => {
  return STATUS_COLORS[status] || STATUS_COLORS.default;
};

export const getStatusLabel = (status: string) => {
  return STATUS_LABELS[status] || status;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', CURRENCY_FORMAT_OPTIONS as Intl.NumberFormatOptions).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-AU', DATE_FORMAT_OPTIONS as Intl.DateTimeFormatOptions);
};