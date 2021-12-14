import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins/MINUTES_IN_HOUR);
  const minutes = mins % MINUTES_IN_HOUR;
  return `${ hours }h ${minutes}m`;
};

export const getYearFormatDate = (date) => dayjs(date).format('YYYY');
export const getDayFormatDate = (date) => dayjs(date).format('D MMMM YYYY');
export const getFullFormatDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

// for Generator
export const getRandomDayDate = (daysGap) => dayjs().subtract(daysGap, 'day').toDate();
export const getRandomMinuteDate = (minutesGap) => dayjs().subtract(minutesGap, 'minute').toDate();

export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return str;
  }

  return (str[0].toUpperCase() + str.slice(1));
};

// \\\\\\\\

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
