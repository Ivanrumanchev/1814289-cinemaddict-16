const cardToFilterMap = {
  // all: (cards) => cards.length,
  watchlist: (cards) => cards.filter((card) => card.userDetails.watchList).length,
  history: (cards) => cards.filter((card) => card.userDetails.alreadyWatched).length,
  favorites: (cards) => cards.filter((card) => card.userDetails.favorite).length,
};

export const generateFilter = (cards) => Object.entries(cardToFilterMap).map(
  ([filterName, countCards]) => ({
    name: filterName,
    count: countCards(cards),
  }),
);
