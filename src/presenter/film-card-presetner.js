import FilmCardView from '../view/film-card-view.js';

import PopupView from '../view/popup-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsListView from '../view/popup-comments-list-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';

import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {getDeepCopy} from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENING: 'OPENING',
};

export default class FilmCardPresenter {
  #filmsListElement = null;
  #changeData = null;
  #changeMode = null;

  #cardComponent = null;
  #mode = Mode.DEFAULT

  #popupComponent = null;
  #popupFilmDetailsComponent = null;
  #popupCommentsListComponent = null;
  #popupCommentComponents = [];
  #popupNewCommentComponent = null;

  #card = null;

  constructor(filmsListElement, changeData, changeMode) {
    this.#filmsListElement = filmsListElement;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (card) => {
    this.#card = card;

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new FilmCardView(card);

    this.#popupComponent = new PopupView();
    this.#popupFilmDetailsComponent = new PopupFilmDetailsView(card);
    this.#popupCommentsListComponent = new PopupCommentsListView(card);
    this.#popupCommentComponents = card.comments.map((comment) => new PopupCommentView(comment));
    this.#popupNewCommentComponent = new PopupNewCommentView();

    this.#cardComponent.setOpenPopupClickHandler(this.#handleOpenPopupClick);
    this.#cardComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListCardClick);
    this.#cardComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedCardClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteCardClick);

    if (prevCardComponent === null) {
      render(this.#filmsListElement, this.#cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmsListElement.contains(prevCardComponent.element)) {
      replace(this.#cardComponent, prevCardComponent);
    }

    remove(prevCardComponent);
  }

  destroy = () => {
    remove(this.#cardComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleClosePopupClick();
    }
  }

  #closeButtonClickHandler = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    remove(this.#popupFilmDetailsComponent);
    remove(this.#popupCommentsListComponent);
    this.#popupCommentComponents.forEach((component) => remove(component));
    remove(this.#popupNewCommentComponent);
  }

  #filmCardClickHandler = () => {
    const filmDetails = this.#popupComponent.element.querySelector('.film-details__inner');
    const commentsList = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');
    this.#popupCommentComponents.forEach((component) => render(commentsList, component, RenderPosition.BEFOREEND));
    render(commentsList, this.#popupNewCommentComponent, RenderPosition.AFTEREND);
    render(filmDetails, this.#popupCommentsListComponent, RenderPosition.BEFOREEND);
    render(filmDetails, this.#popupFilmDetailsComponent, RenderPosition.AFTERBEGIN);
    render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);
    document.body.classList.add('hide-overflow');

    this.#popupFilmDetailsComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListPopupClick);
    this.#popupFilmDetailsComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedPopupClick);
    this.#popupFilmDetailsComponent.setFavoriteClickHandler(this.#handleFavoritePopupClick);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleClosePopupClick();
    }
  }

  #handleOpenPopupClick = () => {
    this.#changeMode();
    this.#filmCardClickHandler();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#popupFilmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopupClick);
    this.#mode = Mode.OPENING;
  }

  #handleClosePopupClick = () => {
    this.#closeButtonClickHandler();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #createNewCardChanged = (property) => {
    const newCard = getDeepCopy(this.#card);
    newCard.userDetails[property] = !newCard.userDetails[property];
    return newCard;
  }

  #handleAddToWatchListCardClick = () => {
    this.#cardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist').classList.toggle('film-card__controls-item--active');
    if (this.#mode === Mode.OPENING) {
      this.#handleAddToWatchListPopupClick();
      return;
    }
    this.#changeData( this.#createNewCardChanged('watchList') );
  }

  #handleMarkAsWatchedCardClick = () => {
    this.#cardComponent.element.querySelector('.film-card__controls-item--mark-as-watched').classList.toggle('film-card__controls-item--active');
    if (this.#mode === Mode.OPENING) {
      this.#handleMarkAsWatchedPopupClick();
      return;
    }
    this.#changeData( this.#createNewCardChanged('alreadyWatched') );
  }

  #handleFavoriteCardClick = () => {
    this.#cardComponent.element.querySelector('.film-card__controls-item--favorite').classList.toggle('film-card__controls-item--active');
    if (this.#mode === Mode.OPENING) {
      this.#handleFavoritePopupClick();
      return;
    }
    this.#changeData( this.#createNewCardChanged('favorite') );
  }

  #handleAddToWatchListPopupClick = () => {
    this.resetView();
    this.#changeData( this.#createNewCardChanged('watchList') );
    this.#handleOpenPopupClick();
  }

  #handleMarkAsWatchedPopupClick = () => {
    this.resetView();
    this.#changeData( this.#createNewCardChanged('alreadyWatched') );
    this.#handleOpenPopupClick();
  }

  #handleFavoritePopupClick = () => {
    this.resetView();
    this.#changeData( this.#createNewCardChanged('favorite') );
    this.#handleOpenPopupClick();
  }
}
