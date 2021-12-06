import {getRandomDayDate, getRandomMinuteDate} from '../utils/common.js';

const TITLES = [
  'Том и Джери',
  'Братец медвежонок',
  'Балто',
  'Дорога на Эльдорадо',
  'Тайна Коко',
];
const DIRECTORS = [
  'Фил Роман',
  'Роберт Уокер',
  'Саймон Уэллс',
  'Джеффри Катценберг',
  'Ли Анкрич',
];
const WRITERS = [
  'Бибо Бержерон',
  'Тим Райс',
  'Элтон Джон',
  'Дон Пол',
  'Эдриан Молина',
];
const ACTORS = [
  'Морган Фриман',
  'Джонни Деп',
  'Анджелина Джоли',
  'Киану Ривз',
  'Энтони Хопкинс',
];
const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];
const POSTERS_URL = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
];
const COUNTRIES = [
  'Россия',
  'США',
  'Англия',
  'Италия',
  'Южная Корея',
];
const GENRES = [
  'Комедия',
  'Драма',
  'Криминал',
  'Ужасы',
  'Семейное',
];
const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];
const COMMENTS_QUANTITY_MIN = 0;
const COMMENTS_QUANTITY_MAX = 10;
const RAITING_MIN = 0;
const RAITING_MAX = 9;
const AGE_RAITING_MIN = 0;
const AGE_RAITING_MAX = 0;
const RUNTIME_MIN = 70;
const RUNTUME_MAX = 150;
const DESCRIPTIONS_QUANTITY_MIN = 0;
const DESCRIPTIONS_QUANTITY_MAX = 4;
const MAX_MINUTES_GAP = 5.256e6;
const MAX_DAYS_GAP = 365e2;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRandomString = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

const generateRandomArray = (arr) => {
  const quantity = getRandomInteger(0, arr.length - 1);
  const newArr = arr.slice();

  const severalItem = [];
  for (let i = 0; i <= quantity; i++) {
    severalItem.push( newArr.splice(getRandomInteger(0, (quantity - i)), 1)[0] );
  }

  return severalItem;
};

const generateDateComment = () => {
  const secondsGap = getRandomInteger(0, MAX_MINUTES_GAP);

  return getRandomMinuteDate(secondsGap);
};

const generateDateRelease = () => {
  const daysGap = getRandomInteger(0, MAX_DAYS_GAP);

  return getRandomDayDate(daysGap);
};

const generateId = () => {
  let id = 0;
  return () => id++;
};
const movieId = generateId();
const commentId = generateId();

const generateComment = () => ({
  id: commentId(),
  author: generateRandomString(WRITERS),
  comment: generateRandomString(DESCRIPTION),
  date: generateDateComment(),
  emotion: generateRandomString(EMOTIONS),
});

export const generateMovie = () => ({
  id: movieId(),
  comments: Array.from( {length: getRandomInteger(COMMENTS_QUANTITY_MIN, COMMENTS_QUANTITY_MAX)}, generateComment ),
  filmInfo: {
    title: generateRandomString(TITLES),
    alternativeTitle: generateRandomString(TITLES),
    totalRating: (+`${getRandomInteger(RAITING_MIN, RAITING_MAX)}.${getRandomInteger(RAITING_MIN, RAITING_MAX)}`).toFixed(1),
    poster: generateRandomString(POSTERS_URL),
    ageRating: getRandomInteger(AGE_RAITING_MIN, AGE_RAITING_MAX),
    director: generateRandomString(DIRECTORS),
    writers: generateRandomArray(WRITERS),
    actors: generateRandomArray(ACTORS),
    release: {
      date: generateDateRelease(),
      releaseCountry: generateRandomString(COUNTRIES)
    },
    runtime: getRandomInteger(RUNTIME_MIN, RUNTUME_MAX),
    genre: generateRandomArray(GENRES),
    description: generateRandomArray(DESCRIPTION).slice(DESCRIPTIONS_QUANTITY_MIN, DESCRIPTIONS_QUANTITY_MAX).join(' ')
  },
  userDetails: {
    watchList: Boolean(getRandomInteger()),
    alreadyWatched: Boolean(getRandomInteger()),
    watchingDate: generateDateRelease(),
    favorite: Boolean(getRandomInteger())
  }
});


