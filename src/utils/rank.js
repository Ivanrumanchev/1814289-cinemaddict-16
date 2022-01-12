const Ranks = {
  NOVICE: 'Novice',
  FAN: 'Fun',
  MOVIE_BUFF: 'Movie Buff',
};

const QuantityLevel = {
  NOVICE: 10,
  FAN: 20,
};

export const getRank = (quantityFilms) => {
  if (!quantityFilms) {
    return '';
  } else if (quantityFilms <= QuantityLevel.NOVICE) {
    return Ranks.NOVICE;
  } else if ( (quantityFilms > QuantityLevel.NOVICE) && (quantityFilms <= QuantityLevel.FAN) ) {
    return Ranks.FAN;
  }
  return Ranks.MOVIE_BUFF;
};
