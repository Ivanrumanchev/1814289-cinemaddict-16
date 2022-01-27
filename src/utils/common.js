import dayjs from 'dayjs';
import toSnakeCase from 'lodash/snakeCase';
import toCamelCase from 'lodash/camelCase';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {MINUTES_IN_HOUR} from '../const.js';

dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

const DateRange = {
  TODAY: '1',
  WEEK: '7',
  MONTH: '28',
  YEAR: '365',
};

const DateFormat = {
  YEAR: 'YYYY',
  DAY: 'd',
  FULL: 'D MMMM YYYY',
};

export const DateFrom = {
  TODAY: dayjs().subtract(DateRange.TODAY, 'day').toDate(),
  WEEK: dayjs().subtract(DateRange.WEEK, 'day').toDate(),
  MONTH: dayjs().subtract(DateRange.MONTH, 'day').toDate(),
  YEAR: dayjs().subtract(DateRange.YEAR, 'day').toDate(),
};

export const isAfterDate = (dateTarget, dateFrom) => dayjs(dateTarget).isSameOrAfter(dateFrom, DateFormat.DAY);

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins/MINUTES_IN_HOUR);
  const minutes = mins % MINUTES_IN_HOUR;

  return `${ hours }h ${minutes}m`;
};

export const getYearFormatDate = (date) => dayjs(date).format(DateFormat.YEAR);
export const getDayFormatDate = (date) => dayjs(date).format(DateFormat.FULL);
export const getHumanFormatDate = (date) => dayjs(date).fromNow();

export const sortCardDate = (cardA, cardB) => dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));
export const sortCardRating = (cardA, cardB) => cardB.filmInfo.totalRating - cardA.filmInfo.totalRating;
export const sortCardComments = (cardA, cardB) => cardB.comments.length - cardA.comments.length;

export const adaptToSnakeCase = (inObject) => {
  const keyValues = Object.keys(inObject).map((key) => {
    const value = inObject[key];
    const keyInSnakeCase = toSnakeCase(key);

    if (Array.isArray(value) || typeof value !== 'object' || value === null) {
      return (key === keyInSnakeCase) ? {[key]: value} : {[keyInSnakeCase]: value};
    }

    const adaptedObject = adaptToSnakeCase(value);

    return (key === keyInSnakeCase) ? {[key]: adaptedObject} : {[keyInSnakeCase]: adaptedObject};
  });

  return Object.assign({}, ...keyValues);
};

export const adaptToCamelCase = (inObject) => {
  const keyValues = Object.keys(inObject).map((key) => {
    const value = inObject[key];
    const keyInCamelCase = toCamelCase(key);

    if (Array.isArray(value) || typeof value !== 'object' || value === null) {
      return (key === keyInCamelCase) ? {[key]: value} : {[keyInCamelCase]: value};
    }

    const adaptedObject = adaptToCamelCase(value);

    return (key === keyInCamelCase) ? {[key]: adaptedObject} : {[keyInCamelCase]: adaptedObject};
  });

  return Object.assign({}, ...keyValues);
};
