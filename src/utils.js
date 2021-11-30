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

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};
