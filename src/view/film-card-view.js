import {getTimeFromMins, getYearFormatDate} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import AbstractView from './abstract-view.js';
import PopupView from './popup-view.js';
import PopupFilmDetailsView from './popup-film-details-view.js';
import PopupCommentsListView from './popup-comments-list-view.js';
import PopupCommentView from './popup-comment-view.js';
import PopupNewCommentView from './popup-new-comment-view.js';

const MAX_LENGTH_DESCRIPTION = 140;

const cutString = (string) => {
  if (string.length > MAX_LENGTH_DESCRIPTION) {
    return `${string.slice(0, (MAX_LENGTH_DESCRIPTION - 1) )}${String.fromCharCode(8230)}`;
  }
  return string;
};

const createFilmCardTemplate = ({comments, filmInfo, userDetails}) => {
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

export default class FilmCardView extends AbstractView {
  #card = null;

  constructor (card) {
    super();
    this.#card = card;
  }

  get template() {
    return createFilmCardTemplate(this.#card);
  }

  init() {
    const popupComponent = new PopupView();
    const popupFilmDetailsComponent = new PopupFilmDetailsView(this.#card);
    const popupCommentsListComponent = new PopupCommentsListView(this.#card);
    const popupCommentComponents = this.#card.comments.map((comment) => new PopupCommentView(comment));
    const popupNewCommentComponent = new PopupNewCommentView();

    const onCloseButtonClick = () => {
      document.body.classList.remove('hide-overflow');
      remove(popupComponent);
      remove(popupFilmDetailsComponent);
      remove(popupCommentsListComponent);
      popupCommentComponents.forEach((component) => remove(component));
      remove(popupNewCommentComponent);
    };

    const onFilmCardClick = () => {
      const filmDetails = popupComponent.element.querySelector('.film-details__inner');
      const commentsList = popupCommentsListComponent.element.querySelector('.film-details__comments-list');
      popupCommentComponents.forEach((component) => render(commentsList, component, RenderPosition.BEFOREEND));
      render(commentsList, popupNewCommentComponent, RenderPosition.AFTEREND);
      render(filmDetails, popupCommentsListComponent, RenderPosition.BEFOREEND);
      render(filmDetails, popupFilmDetailsComponent, RenderPosition.AFTERBEGIN);
      render(document.body, popupComponent, RenderPosition.BEFOREEND);
      document.body.classList.add('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        onCloseButtonClick();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    this.setOpenPopupClickHandler(() => {
      onFilmCardClick();
      document.addEventListener('keydown', onEscKeyDown);
      popupFilmDetailsComponent.setClosePopupClickHandler(() => {
        onCloseButtonClick();
        document.removeEventListener('keydown', onEscKeyDown);
      });
    });
  }

  setOpenPopupClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupClickHandler);
  }

  #openPopupClickHandler = () => {
    this._callback.click();
  }
}
