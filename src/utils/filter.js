import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (cards) => cards.slice(),
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.userDetails.watchlist),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.userDetails.favorite),
  [FilterType.STATISTICS]: (cards) => cards.slice(),
};

export const getQuantityFilteredMovies = (cards) =>
  cards.reduce((counter, card) => {
    if (card.userDetails.watchlist) {
      counter[FilterType.WATCHLIST]++;
    }

    if (card.userDetails.alreadyWatched) {
      counter[FilterType.HISTORY]++;
    }

    if (card.userDetails.favorite) {
      counter[FilterType.FAVORITES]++;
    }

    return counter;
  }, {[FilterType.WATCHLIST]: 0, [FilterType.HISTORY]: 0, [FilterType.FAVORITES]: 0});
