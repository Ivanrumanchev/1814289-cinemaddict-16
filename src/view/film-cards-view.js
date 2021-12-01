import {getTimeFromMins, getYearFormatDate, createElement} from '../utils.js';

const MAX_LENGTH_DESCRIPTION = 140;

const cutString = (string) => {
  if (string.length > MAX_LENGTH_DESCRIPTION) {
    return `${string.slice(0, (MAX_LENGTH_DESCRIPTION - 1) )}${String.fromCharCode(8230)}`;
  }
  return string;
};

const createFilmCardsTemplate = ({comments, filmInfo, userDetails}) => {
  const {title, totalRating, poster, release, runtime, genre, description} = filmInfo;
  const {watchList, alreadyWatched, favorite} = userDetails;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${ title }</h3>
      <p class="film-card__rating">${ totalRating }</p>
      <p class="film-card__info">
        <span class="film-card__year">${ getYearFormatDate(release.date) }</span>
        <span class="film-card__duration">${ getTimeFromMins(runtime) }</span>
        <span class="film-card__genre">${ genre[0] }</span>
      </p>
      <img src=${ poster } alt="" class="film-card__poster">
      <p class="film-card__description">${ cutString(description) }</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${ watchList ? ' film-card__controls-item--active' : '' }" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched${ alreadyWatched ? ' film-card__controls-item--active' : '' }" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite${ favorite ? ' film-card__controls-item--active' : '' }" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView {
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
    return createFilmCardsTemplate(this.#cards);
  }

  removeElement() {
    this.#element = null;
  }
}
