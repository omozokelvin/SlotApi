import { format, isValid } from 'date-fns';

export const formatDate = (date: Date | null) => {
  if (!date) {
    return null;
  }

  const dateObj = new Date(date);

  if (!isValid(dateObj)) {
    return null;
  }

  return new Date(format(dateObj, 'yyyy-MM-dd'));
};

export const mediumDate = (date: Date | string): string => {
  return format(new Date(date), 'd MMM yyyy');
};

export const longDate = (date: Date | string): string => {
  return format(new Date(date), 'd MMM yyyy, HH:mm a');
};

export const getNow = () => {
  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
};
