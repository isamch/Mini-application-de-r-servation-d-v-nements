import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

export function formatTime(time) {
  if (!time) return '';
  try {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Time formatting error:', error);
    return time;
  }
}

export function getEventStatus(status) {
  const statusMap = {
    draft: 'Draft',
    published: 'Published',
    canceled: 'Canceled'
  };
  return statusMap[status] || status;
}

export function getBookingStatus(status) {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    refused: 'Refused',
    canceled: 'Canceled'
  };
  return statusMap[status] || status;
}

export function getStatusColor(status) {
  const colorMap = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    refused: 'bg-red-100 text-red-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}