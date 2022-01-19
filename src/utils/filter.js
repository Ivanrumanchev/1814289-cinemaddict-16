import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (cards) => cards.slice(),
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.userDetails.watchlist),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.userDetails.favorite),
  [FilterType.STATISTICS]: (cards) => cards.slice(),
};
