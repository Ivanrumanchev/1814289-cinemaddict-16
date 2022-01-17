// import FilmCardView from '../view/film-card-view.js';

import PopupView from '../view/popup-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsListView from '../view/popup-comments-list-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';

import {RenderPosition, render, remove} from '../utils/render.js';
import {createNewCard} from '../utils/common.js';
import {UserAction, UpdateType, NewCardType, UserDetailsUpdateType, Mode} from '../const.js';

export default class PopupPresenter {
  #updateMovie = null;
  #setScrollY = null;

  #changeModeClose = null;

  #mode = Mode.DEFAULT
  #scrollPopupY = 0;

  #popupComponent = null;
  #popupFilmDetailsComponent = null;
  #popupCommentsListComponent = null;
  #popupCommentComponents = [];
  #popupNewCommentComponent = null;

  #card = null;

  constructor(updateMovie, setScrollY, changeModeClose) {
    this.#updateMovie = updateMovie;

    this.#setScrollY = setScrollY;

    this.#changeModeClose = changeModeClose;
  }

  init = (card, comments) => {
    this.#card = card;

    this.#popupComponent = new PopupView();
    this.#popupFilmDetailsComponent = new PopupFilmDetailsView(card);
    this.#popupCommentsListComponent = new PopupCommentsListView(comments);
    this.#popupCommentComponents = comments?.map((comment) => new PopupCommentView(comment));
    this.#popupNewCommentComponent = new PopupNewCommentView();

    this.#popupNewCommentComponent.setAddNewCommentHandler(this.#handleAddNewCommentKeydown);

    this.#filmCardClickHandler();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#popupFilmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopupClick);
    this.#mode = Mode.OPENING;
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#scrollPopupY = this.#popupComponent.element.scrollTop;
      this.#handleClosePopupClick();
    }
  }

  scrollPopup = (scrollY) => {
    this.#popupComponent.element.scrollTo(0, scrollY);
  }

  handleAddToWatchListPopupClick = () => {
    this.resetView();
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      createNewCard(this.#card, NewCardType.USER_DETAILS, UserDetailsUpdateType.WATCH_LIST),
    );
  }

  handleMarkAsWatchedPopupClick = () => {
    this.resetView();
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      createNewCard(this.#card, NewCardType.USER_DETAILS, UserDetailsUpdateType.ALREADY_WATCHED),
    );
  }

  handleFavoritePopupClick = () => {
    this.resetView();
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR_POPUP,
      createNewCard(this.#card, NewCardType.USER_DETAILS, UserDetailsUpdateType.FAVORITE),
    );
  }

  #renderPopupNewComment = (container) => {
    render(container, this.#popupNewCommentComponent, RenderPosition.AFTEREND);
    this.#popupNewCommentComponent.restoreHandlers();
  }

  #handleClosePopupClick = () => {
    this.#setScrollY(this.#scrollPopupY);
    this.#closeButtonClickHandler();
    this.#popupNewCommentComponent.resetData();
    this.#popupNewCommentComponent.newCommentKeysHandlersRemove();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    this.#changeModeClose();
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

    this.#popupCommentComponents.forEach((component) => {
      render(commentsList, component, RenderPosition.BEFOREEND);
      component.setDeleteButtonClickHandler(this.#handleDeleteCommentClick);
    });

    this.#renderPopupNewComment(commentsList);
    render(filmDetails, this.#popupCommentsListComponent, RenderPosition.BEFOREEND);
    render(filmDetails, this.#popupFilmDetailsComponent, RenderPosition.AFTERBEGIN);
    render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);

    document.body.classList.add('hide-overflow');

    this.#popupFilmDetailsComponent.setAddToWatchListClickHandler(this.handleAddToWatchListPopupClick);
    this.#popupFilmDetailsComponent.setMarkAsWatchedClickHandler(this.handleMarkAsWatchedPopupClick);
    this.#popupFilmDetailsComponent.setFavoriteClickHandler(this.handleFavoritePopupClick);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleClosePopupClick();
    }
  }

  #handleAddNewCommentKeydown = (newComment) => {
    this.resetView();
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      createNewCard(this.#card, NewCardType.NEW_COMMENT, newComment),
    );
  }

  #handleDeleteCommentClick = (commentId) => {
    const indexDeletedComment = this.#card.comments.findIndex(({id}) => id === commentId);
    this.resetView();
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      createNewCard(this.#card, NewCardType.DELETE_COMMENT, indexDeletedComment),
    );
  }
}
