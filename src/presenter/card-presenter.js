import FilmCardView from '../view/film-card-view.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {UserAction, UpdateType/* , Mode */} from '../const.js';

export default class CardPresenter {
  #parentElement = null;
  #updateMovie = null;
  #setOpenPopupCard = null;
  #handleOpenPopup = null;

  #cardComponent = null;

  #card = null;

  constructor(parentElement, updateMovie, setOpenPopupCard, handleOpenPopup) {
    this.#parentElement = parentElement;
    this.#updateMovie = updateMovie;
    this.#setOpenPopupCard = setOpenPopupCard;
    this.#handleOpenPopup = handleOpenPopup;
  }

  init = (card) => {
    this.#card = card;

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new FilmCardView(card);

    this.#cardComponent.setOpenPopupClickHandler(this.#handleOpenPopupClick);
    this.#cardComponent.setAddToWatchListClickHandler(this.#handleAddToWatchClick);
    this.#cardComponent.setMarkAsWatchedClickHandler(this.#handleWatchedClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevCardComponent === null) {
      render(this.#parentElement, this.#cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#parentElement.contains(prevCardComponent.element)) {
      replace(this.#cardComponent, prevCardComponent);
    }

    remove(prevCardComponent);
  }

  destroy = () => {
    remove(this.#cardComponent);
  }

  #handleOpenPopupClick = () => {
    this.#setOpenPopupCard(this.#card);
    this.#handleOpenPopup();
  }

  #handleAddToWatchClick = () => {
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#card, userDetails: {...this.#card.userDetails, watchlist: !this.#card.userDetails.watchlist}},
    );
  }

  #handleWatchedClick = () => {
    const today = new Date();

    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#card, userDetails: {...this.#card.userDetails, alreadyWatched: !this.#card.userDetails.alreadyWatched, watchingDate: today.toISOString()}},
    );
  }

  #handleFavoriteClick = () => {
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#card, userDetails: {...this.#card.userDetails, favorite: !this.#card.userDetails.favorite}},
    );
  }
}
