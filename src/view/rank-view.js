import {createElement} from '../utils.js';

const Ranks = {
  NOVICE: 'Novice',
  FAN: 'Fun',
  MOVIE_BUFF: 'Movie Buff',
};

const QuantityLevel = {
  NOVICE: 10,
  FAN: 20,
};

const getRank = (cards) => {
  const quantityFilms = cards.filter((card) => card.userDetails.alreadyWatched).length;
  if (!quantityFilms) {
    return '';
  } else if (quantityFilms <= QuantityLevel.NOVICE) {
    return Ranks.NOVICE;
  } else if ( (quantityFilms > QuantityLevel.NOVICE) && (quantityFilms <= QuantityLevel.FAN) ) {
    return Ranks.FAN;
  }
  return Ranks.MOVIE_BUFF;
};

const createRankTemplate = (cards) => {
  const rank = getRank(cards);

  return (rank ? `<section class="header__profile profile">
    <p class="profile__rating">${ rank }</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>` : '<section class="visually-hidden"></section>');
};

export default class RankView {
  #element = null;
  #cards = null;

  constructor (cards) {
    this.#cards = cards;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createRankTemplate(this.#cards);
  }

  removeElement() {
    this.#element = null;
  }
}
