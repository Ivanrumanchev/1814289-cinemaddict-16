import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (cards) => cards,
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.userDetails.watchList),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.userDetails.favorite),
  [FilterType.STATISTICS]: (cards) => cards,
};
