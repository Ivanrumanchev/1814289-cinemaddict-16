import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

const MINUTES_IN_HOUR = 60;

const DateRange = {
  TODAY: '1',
  WEEK: '7',
  MONTH: '28',
  YEAR: '365',
};

export const DateFrom = {
  TODAY: dayjs().subtract(DateRange.TODAY, 'day').toDate(),
  WEEK: dayjs().subtract(DateRange.WEEK, 'day').toDate(),
  MONTH: dayjs().subtract(DateRange.MONTH, 'day').toDate(),
  YEAR: dayjs().subtract(DateRange.YEAR, 'day').toDate(),
};

export const isAfterDate = (dateTarget, dateFrom) => dayjs(dateTarget).isSameOrAfter(dateFrom, 'd');

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
