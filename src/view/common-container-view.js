const Ranks = {
  NOVICE: 'Novice',
  FAN: 'Fun',
  MOVIE_BUFF: 'Movie Buff',
};

const getRank = (cards) => {
  const quantityFilms = cards.filter((card) => card.userDetails.alreadyWatched).length;
  if (!quantityFilms) {
    return '';
  } else if (quantityFilms <= 10) {
    return Ranks.NOVICE;
  } else if ( (quantityFilms > 10) && (quantityFilms <= 20) ) {
    return Ranks.FAN;
  }
  return Ranks.MOVIE_BUFF;
};

export const createRankTemplate = (cards) => {
  const rank = getRank(cards);

  return (rank ? `<section class="header__profile profile">
    <p class="profile__rating">${ getRank(cards) }</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>` : '');
};

export const createQuantityFilmsTemplate = (cards) => (
  `<p>${ cards.length } movies inside</p>`
);
