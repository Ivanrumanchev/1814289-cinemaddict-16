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
  #updateComments = null;

  #mode = Mode.DEFAULT

  #popupComponent = null;
  #popupFilmDetailsComponent = null;
  #popupControlButtonsComponent = null;
  #popupCommentsListComponent = null;
  #popupCommentComponents = [];
  #popupNewCommentComponent = null;

  #card = null;

  constructor(updateMovie, updateComments) {
    this.#updateMovie = updateMovie;
    this.#updateComments = updateComments;
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
    this.#popupControlButtonsComponent.resetControlButtons();
    this.#popupControlButtonsComponent.updateData(update);
  }

  reInitComments = (comments) => {
    this.#reInitCommentsList(comments);

    const fail = comments[0]?.fail;
    if (!fail) {
      this.#reInitComments(comments);
    }
  }

  resetNewComment = () => {
    this.#popupNewCommentComponent.resetNewComment();
  }

  resetSavingState = () => {
    this.#popupNewCommentComponent.resetDisabled();
  }

  resetDeletingState = (deletedCommentId) => {
    const deletedCommentComponent = this.#popupCommentComponents.find((component) => component.commentId === deletedCommentId);
    deletedCommentComponent.resetDisabled();
  }

  setSavingState = () => {
    this.#popupNewCommentComponent.setDisabled();
  }

  setDeletingState = (deletedCommentId) => {
    const deletedCommentComponent = this.#popupCommentComponents.find((component) => component.commentId === deletedCommentId);
    deletedCommentComponent.setDisabled();
  }

  #createNewComponentsPopup = (card, comments) => {
    this.#popupComponent = new PopupView();
    this.#popupFilmDetailsComponent = new PopupFilmDetailsView(card);
    this.#popupControlButtonsComponent = new PopupControlButtonsView(card);
    this.#popupCommentsListComponent = new PopupCommentsListView(comments);
    this.#popupCommentComponents = comments.map((comment) => new PopupCommentView(comment));
    this.#popupNewCommentComponent = new PopupNewCommentView();
  }

  #restoreHandlers = () => {
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('mousedown', this.#outPopupClickHandler);
    this.#popupFilmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopupClick);
    this.#popupNewCommentComponent.setAddNewCommentHandler(this.#handleAddNewCommentKeydown);
  }

  #reInitCommentsList = (comments) => {
    this.#popupCommentsListComponent.resetComments();
    this.#popupCommentsListComponent.updateComments(comments);
  }

  #reInitComments = (comments) => {
    this.#popupCommentComponents.forEach(remove);
    this.#popupCommentComponents = comments.map((comment) => new PopupCommentView(comment));

    const commentsList = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');

    this.#popupCommentComponents.forEach((component) => {
      render(commentsList, component, RenderPosition.AFTERBEGIN);
      component.setDeleteButtonClickHandler(this.#handleDeleteCommentClick);
    });

    this.#renderPopupNewComment(commentsList);
  }

  #renderPopupNewComment = (container) => {
    render(container, this.#popupNewCommentComponent, RenderPosition.AFTEREND);
    this.#popupNewCommentComponent.restoreHandlers();
  }

  #handleClosePopupClick = () => {
    this.#handleСloseButtonClick();

    this.#popupNewCommentComponent.resetNewComment();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('mousedown', this.#outPopupClickHandler);

    this.#mode = Mode.DEFAULT;
  }

  #handleСloseButtonClick = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    remove(this.#popupFilmDetailsComponent);
    remove(this.#popupCommentsListComponent);
    this.#popupCommentComponents.forEach(remove);
    remove(this.#popupNewCommentComponent);
  }

  #handleCardClick = () => {
    const filmDetails = this.#popupComponent.element.querySelector('.film-details__inner');
    const filmDetailsInfo = this.#popupFilmDetailsComponent.element.querySelector('.film-details__info-wrap');

    render(filmDetails, this.#popupCommentsListComponent, RenderPosition.BEFOREEND);
    render(filmDetailsInfo, this.#popupControlButtonsComponent, RenderPosition.AFTEREND);
    render(filmDetails, this.#popupFilmDetailsComponent, RenderPosition.AFTERBEGIN);
    render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);

    document.body.classList.add('hide-overflow');

    this.#popupControlButtonsComponent.setAddToWatchListClickHandler(this.#handleAddToWatchClick);
    this.#popupControlButtonsComponent.setMarkAsWatchedClickHandler(this.#handleWatchedClick);
    this.#popupControlButtonsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
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

  #handleAddToWatchClick = () => {
    const updatedCard = {...this.#card,
      userDetails: {...this.#card.userDetails,
        watchlist: !this.#card.userDetails.watchlist}};

    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      updatedCard,
    );
  }

  #handleWatchedClick = () => {
    const today = new Date();
    const updatedCard = {...this.#card,
      userDetails: {...this.#card.userDetails,
        alreadyWatched: !this.#card.userDetails.alreadyWatched,
        watchingDate: today.toISOString()}};

    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      updatedCard,
    );
  }

  #handleFavoriteClick = () => {
    const updatedCard = {...this.#card,
      userDetails: {...this.#card.userDetails,
        favorite: !this.#card.userDetails.favorite}};

    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      updatedCard,
    );
  }

  #handleAddNewCommentKeydown = (newComment) => {
    this.#updateComments(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      newComment,
      this.#card,
    );
  }

  #handleDeleteCommentClick = (commentId) => {
    this.#updateComments(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      commentId,
    );
  }
}
