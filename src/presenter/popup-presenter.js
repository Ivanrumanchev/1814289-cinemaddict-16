import PopupView from '../view/popup-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupControlButtonsView from '../view/popup-control-buttons-view.js';
import PopupCommentsListView from '../view/popup-comments-list-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';

import {RenderPosition, render, remove} from '../utils/render.js';
import {UserAction, UpdateType, Mode} from '../const.js';

export default class PopupPresenter {
  #updateMovie = null;

  #mode = Mode.DEFAULT

  #popupComponent = null;
  #popupFilmDetailsComponent = null;
  #popupControlButtonsComponent = null;
  #popupCommentsListComponent = null;
  #popupCommentComponents = [];
  #popupNewCommentComponent = null;

  #card = null;

  constructor(updateMovie) {
    this.#updateMovie = updateMovie;
  }

  init = (card, comments) => {
    this.#card = card;

    this.#createNewComponentsPopup(card, comments);

    this.#handleCardClick();

    this.#restoreHandlers();

    this.#mode = Mode.OPENING;
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleClosePopupClick();
    }
  }

  setOpenCard = (card) => {
    this.#card = card;
  }

  reInitControlButtons = (update) => {
    this.#updateControlButtons(update);
  }

  reInitComments = (update) => {
    this.#updateCommentsList(update);
    this.#updateComments(update);
  }

  #createNewComponentsPopup = (card, comments) => {
    this.#popupComponent = new PopupView();
    this.#popupFilmDetailsComponent = new PopupFilmDetailsView(card);
    this.#popupControlButtonsComponent = new PopupControlButtonsView(card);
    this.#popupCommentsListComponent = new PopupCommentsListView(comments);
    this.#popupCommentComponents = comments?.map((comment) => new PopupCommentView(comment));
    this.#popupNewCommentComponent = new PopupNewCommentView();
  }

  #restoreHandlers = () => {
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('mousedown', this.#outPopupClickHandler);
    this.#popupFilmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopupClick);
    this.#popupNewCommentComponent.setAddNewCommentHandler(this.#handleAddNewCommentKeydown);
  }

  #updateCommentsList = (update) => {
    this.#popupCommentsListComponent.resetData();
    this.#popupCommentsListComponent.updateData(update);
  }

  #updateComments = (update) => {
    this.#popupCommentComponents.forEach((component) => remove(component));
    this.#popupCommentComponents = update?.map((comment) => new PopupCommentView(comment));

    const commentsList = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');

    this.#popupCommentComponents.forEach((component) => {
      render(commentsList, component, RenderPosition.AFTERBEGIN);
      component.setDeleteButtonClickHandler(this.#handleDeleteCommentClick);
    });

    this.#renderPopupNewComment(commentsList);
  }

  #updateControlButtons = (update) => {
    this.#popupControlButtonsComponent.resetData();
    this.#popupControlButtonsComponent.updateData(update);
  }

  #renderPopupNewComment = (container) => {
    render(container, this.#popupNewCommentComponent, RenderPosition.AFTEREND);
    this.#popupNewCommentComponent.restoreHandlers();
  }

  #handleClosePopupClick = () => {
    this.#handleСloseButtonClick();

    this.#popupNewCommentComponent.resetData();
    this.#popupNewCommentComponent.newCommentKeysHandlersRemove();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('mousedown', this.#outPopupClickHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleСloseButtonClick = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    remove(this.#popupFilmDetailsComponent);
    remove(this.#popupCommentsListComponent);
    this.#popupCommentComponents.forEach((component) => remove(component));
    remove(this.#popupNewCommentComponent);
  }

  #handleCardClick = () => {
    const filmDetails = this.#popupComponent.element.querySelector('.film-details__inner');
    const commentsList = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');
    const filmDetailsInfo = this.#popupFilmDetailsComponent.element.querySelector('.film-details__info-wrap');

    this.#popupCommentComponents.forEach((component) => {
      render(commentsList, component, RenderPosition.BEFOREEND);
      component.setDeleteButtonClickHandler(this.#handleDeleteCommentClick);
    });

    this.#renderPopupNewComment(commentsList);
    render(filmDetails, this.#popupCommentsListComponent, RenderPosition.BEFOREEND);
    render(filmDetailsInfo, this.#popupControlButtonsComponent, RenderPosition.AFTEREND);
    render(filmDetails, this.#popupFilmDetailsComponent, RenderPosition.AFTERBEGIN);
    render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);

    document.body.classList.add('hide-overflow');

    this.#popupControlButtonsComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListPopupClick);
    this.#popupControlButtonsComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedPopupClick);
    this.#popupControlButtonsComponent.setFavoriteClickHandler(this.#handleFavoritePopupClick);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleClosePopupClick();
    }
  }

  #outPopupClickHandler = (evt) => {
    const isClickInside = this.#popupComponent.element.contains(evt.target);

    if (!isClickInside) {
      this.#handleClosePopupClick();
    }
  }

  #handleAddToWatchListPopupClick = () => {
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      {...this.#card, userDetails: {...this.#card.userDetails, watchlist: !this.#card.userDetails.watchlist}},
    );
  }

  #handleMarkAsWatchedPopupClick = () => {
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      {...this.#card, userDetails: {...this.#card.userDetails, alreadyWatched: !this.#card.userDetails.alreadyWatched}},
    );
  }

  #handleFavoritePopupClick = () => {
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      {...this.#card, userDetails: {...this.#card.userDetails, favorite: !this.#card.userDetails.favorite}},
    );
  }

  #handleAddNewCommentKeydown = (newComment) => {
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this.#card, comments: {...this.#card.comments, newComment}},
    );
  }

  #handleDeleteCommentClick = (commentId) => {
    const indexDeletedComment = this.#card.comments.findIndex(({id}) => id === commentId);
    const newCard = {...this.#card, comments: Object.values(this.#card.comments)};

    newCard.comments.splice(indexDeletedComment, 1);

    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      newCard,
    );
  }
}
