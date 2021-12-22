import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const MINUTES_IN_HOUR = 60;

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins/MINUTES_IN_HOUR);
  const minutes = mins % MINUTES_IN_HOUR;
  return `${ hours }h ${minutes}m`;
};

export const getYearFormatDate = (date) => dayjs(date).format('YYYY');
export const getDayFormatDate = (date) => dayjs(date).format('D MMMM YYYY');
export const getHumanFormatDate = (date) => dayjs(date).fromNow();

// for Generator
export const getRandomDayDate = (daysGap) => dayjs().subtract(daysGap, 'day').toString();
export const getRandomMinuteDate = (minutesGap) => dayjs().subtract(minutesGap, 'minute').toString();

export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return str;
  }

  return (str[0].toUpperCase() + str.slice(1));
};


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

export const getDeepCopy = (inObject) => {
  if (typeof inObject !== 'object' || inObject === null) {
    return inObject;
  }

  const outObject = Array.isArray(inObject) ? [] : {};

  for (const key in inObject) {
    const value = inObject[key];

    outObject[key] = getDeepCopy(value);
  }

  return outObject;
};

export const sortCardDate = (cardA, cardB) => dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));
export const sortCardRating = (cardA, cardB) => cardB.filmInfo.totalRating - cardA.filmInfo.totalRating;
export const sortCardComments = (cardA, cardB) => cardB.comments.length - cardA.comments.length;
