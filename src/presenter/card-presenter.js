import FilmCardView from '../view/film-card-view.js';
import PopupPresenter from './popup-presenter.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {createNewCard} from '../utils/common.js';
import {UserAction, UpdateType, NewCardType, UserDetailsUpdateType, Mode} from '../const.js';

const loadingComments = [{
  comment: 'Loading...',
  emotion: 'sleeping',
  loading: true,
}];

export default class CardPresenter {
  #parentElement = null;
  #updateMovie = null;
  #changeModeOpen = null;
  #changeScrollY = null;
  #commentsModel = null;

  #cardComponent = null;

  #popupPresenter = null;

  #card = null;
  #mode = Mode.DEFAULT

  constructor(parentElement, updateMovie, changeModeOpen, changeScrollY, commentsModel) {
    this.#parentElement = parentElement;
    this.#updateMovie = updateMovie;
    this.#changeModeOpen = changeModeOpen;
    this.#changeScrollY = changeScrollY;
    this.#commentsModel = commentsModel;
  }

  init = (card) => {
    this.#card = card;

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new FilmCardView(card);

    this.#popupPresenter = new PopupPresenter(this.#updateMovie, this.#changeScrollY, this.#changeModeClose);

    this.#cardComponent.setOpenPopupClickHandler(this.handleOpenPopupClick);
    this.#cardComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListCardClick);
    this.#cardComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedCardClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteCardClick);

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

  resetView = () => {
    this.#popupPresenter.resetView();
  }

  scrollPopup = (scrollY) => {
    this.#popupPresenter.scrollPopup(scrollY);
  }

  handleOpenPopupClick = () => {
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#changeModeOpen(this.#card);

    this.#popupPresenter.init(this.#card, loadingComments);
    this.#commentsModel.init(this.#card);

    this.#mode = Mode.OPENING;
  }

  handleReOpenPopupClick = () => {
    this.#changeModeOpen(this.#card);

    this.#popupPresenter.init(this.#card, this.#commentsModel.comments);

    this.#mode = Mode.OPENING;
  }

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.resetView();
        this.handleReOpenPopupClick();
    }
  }

  #changeModeClose = () => {
    this.#mode = Mode.DEFAULT;
    this.#commentsModel.removeObserver(this.#handleModelEvent);
  }

  #handleAddToWatchListCardClick = () => {
    if (this.#mode === Mode.OPENING) {
      this.#popupPresenter.handleAddToWatchListPopupClick();
      return;
    }
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      createNewCard(this.#card, NewCardType.USER_DETAILS, UserDetailsUpdateType.WATCH_LIST),
    );
  }

  #handleMarkAsWatchedCardClick = () => {
    if (this.#mode === Mode.OPENING) {
      this.#popupPresenter.handleMarkAsWatchedPopupClick();
      return;
    }
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      createNewCard(this.#card, NewCardType.USER_DETAILS, UserDetailsUpdateType.ALREADY_WATCHED),
    );
  }

  #handleFavoriteCardClick = () => {
    if (this.#mode === Mode.OPENING) {
      this.#popupPresenter.handleFavoritePopupClick();
      return;
    }
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      createNewCard(this.#card, NewCardType.USER_DETAILS, UserDetailsUpdateType.FAVORITE),
    );
  }
}
