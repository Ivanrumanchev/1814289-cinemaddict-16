import {MINUTES_IN_HOUR} from '../const.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import toSnakeCase from 'lodash/snakeCase';
import toCamelCase from 'lodash/camelCase';
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
