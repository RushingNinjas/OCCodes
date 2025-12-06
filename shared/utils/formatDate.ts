import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatDateRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

