import { format, startOfWeek, addDays } from 'date-fns';

export const getWeekDates = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(date, formatStr);
};

export const getDayName = (date) => {
  return format(date, 'EEEE'); // Full day name
};

export const getShortDayName = (date) => {
  return format(date, 'EEE'); // Short day name (Sun, Mon, etc.)
};

export const isSameDay = (date1, date2) => {
  return format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');
};
