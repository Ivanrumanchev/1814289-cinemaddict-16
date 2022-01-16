import {MINUTES_IN_HOUR} from '../const.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import rfdc from 'rfdc';
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

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
export const getFullFormatDate = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
export const getHumanFormatDate = (date) => dayjs(date).fromNow();

// for Generator
export const getRandomDayDate = (daysGap) => dayjs().subtract(daysGap, 'day').toDate();
export const getRandomMinuteDate = (minutesGap) => dayjs().subtract(minutesGap, 'minute').toDate();

export const getDeepCopy = rfdc();

export const sortCardDate = (cardA, cardB) => dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));
export const sortCardRating = (cardA, cardB) => cardB.filmInfo.totalRating - cardA.filmInfo.totalRating;
export const sortCardComments = (cardA, cardB) => cardB.comments.length - cardA.comments.length;
