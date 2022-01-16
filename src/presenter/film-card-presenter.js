import FilmCardView from '../view/film-card-view.js';

import PopupPresenter from './popup-presenter.js';

// import PopupView from '../view/popup-view.js';
// import PopupFilmDetailsView from '../view/popup-film-details-view.js';
// import PopupCommentsListView from '../view/popup-comments-list-view.js';
// import PopupCommentView from '../view/popup-comment-view.js';
// import PopupNewCommentView from '../view/popup-new-comment-view.js';

import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {getDeepCopy, getFullFormatDate} from '../utils/common.js';
import {UserAction, UpdateType} from '../const.js';

// const Mode = {
//   DEFAULT: 'DEFAULT',
//   OPENING: 'OPENING',
// };

const NewCardType = {
  USER_DETAILS: 'USER_DETAILS',
  NEW_COMMENT: 'NEW_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UserDetailsUpdateType = {
  WATCH_LIST: 'watchlist',
  ALREADY_WATCHED: 'alreadyWatched',
  FAVORITE: 'favorite',
};

export default class FilmCardPresenter {
  #parentElement = null;
  #updateMovie = null;
  #changeModeOpen = null;
  #changeModeClose = null;
  #commentsModel = null;

  #cardComponent = null;
  // #mode = Mode.DEFAULT
  // #scrollPopupY = 0;

  // #popupComponent = null;
  // #popupFilmDetailsComponent = null;
  // #popupCommentsListComponent = null;
  // #popupCommentComponents = [];
  // #popupNewCommentComponent = null;

  #popupPresenter = null;

  #card = null;

  constructor(parentElement, updateMovie, changeModeOpen, changeModeClose, commentsModel) {
    this.#parentElement = parentElement;
    this.#updateMovie = updateMovie;
    this.#changeModeOpen = changeModeOpen;
    this.#changeModeClose = changeModeClose;
    this.#commentsModel = commentsModel;
  }

  init = (card) => {
    this.#card = card;

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new FilmCardView(card);

    // this.#popupComponent = new PopupView();
    // this.#popupFilmDetailsComponent = new PopupFilmDetailsView(card);
    // this.#popupCommentsListComponent = new PopupCommentsListView(card);
    // this.#popupCommentComponents = card.comments.map((comment) => new PopupCommentView(comment));
    // this.#popupNewCommentComponent = new PopupNewCommentView();

    this.#popupPresenter = new PopupPresenter(this.#updateMovie, this.#changeModeClose);

    this.#cardComponent.setOpenPopupClickHandler(this.handleOpenPopupClick);
    this.#cardComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListCardClick);
    this.#cardComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedCardClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteCardClick);

    // this.#popupNewCommentComponent.setAddNewCommentHandler(this.#handleAddNewCommentKeydown);

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
  //   if (this.#mode !== Mode.DEFAULT) {
  //     // this.#scrollPopupY = this.#popupComponent.element.scrollTop;
  //     this.#handleClosePopupClick();
  //   }
    this.#popupPresenter.resetView();
  }

  scrollPopup = (scrollY) => {
  //   this.#popupComponent.element.scrollTo(0, scrollY);
    this.#popupPresenter.scrollPopup(scrollY);
  }

  handleOpenPopupClick = () => {
    this.#changeModeOpen(this.#card);

    this.#popupPresenter.init(this.#card);
    // this.#filmCardClickHandler();
    // document.addEventListener('keydown', this.#escKeyDownHandler);
    // this.#popupFilmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopupClick);
    // this.#mode = Mode.OPENING;
  }

  // #handleClosePopupClick = () => {
  //   // this.#changeModeClose(this.#scrollPopupY);
  //   this.#closeButtonClickHandler();
  //   this.#popupNewCommentComponent.resetData();
  //   this.#popupNewCommentComponent.newCommentKeysHandlersRemove();
  //   document.removeEventListener('keydown', this.#escKeyDownHandler);
  //   this.#mode = Mode.DEFAULT;
  // }

  // #renderPopupNewComment = (container) => {
  //   render(container, this.#popupNewCommentComponent, RenderPosition.AFTEREND);
  //   this.#popupNewCommentComponent.restoreHandlers();
  // }

  // #closeButtonClickHandler = () => {
  //   document.body.classList.remove('hide-overflow');
  //   remove(this.#popupComponent);
  //   remove(this.#popupFilmDetailsComponent);
  //   remove(this.#popupCommentsListComponent);
  //   this.#popupCommentComponents.forEach((component) => remove(component));
  //   remove(this.#popupNewCommentComponent);
  // }

  // #filmCardClickHandler = () => {
  //   const filmDetails = this.#popupComponent.element.querySelector('.film-details__inner');
  //   const commentsList = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');

  //   this.#popupCommentComponents.forEach((component) => {
  //     render(commentsList, component, RenderPosition.BEFOREEND);
  //     component.setDeleteButtonClickHandler(this.#handleDeleteCommentClick);
  //   });

  //   this.#renderPopupNewComment(commentsList);
  //   render(filmDetails, this.#popupCommentsListComponent, RenderPosition.BEFOREEND);
  //   render(filmDetails, this.#popupFilmDetailsComponent, RenderPosition.AFTERBEGIN);
  //   render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);

  //   document.body.classList.add('hide-overflow');

  //   this.#popupFilmDetailsComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListPopupClick);
  //   this.#popupFilmDetailsComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedPopupClick);
  //   this.#popupFilmDetailsComponent.setFavoriteClickHandler(this.#handleFavoritePopupClick);
  // }

  // #escKeyDownHandler = (evt) => {
  //   if (evt.key === 'Escape' || evt.key === 'Esc') {
  //     evt.preventDefault();
  //     this.#handleClosePopupClick();
  //   }
  // }

  #createNewCard = (updateType, update) => {
    const newCard = getDeepCopy(this.#card);

    switch (updateType) {
      case NewCardType.USER_DETAILS:
        newCard.userDetails[update] = !newCard.userDetails[update];

        if (update === UserDetailsUpdateType.ALREADY_WATCHED) {
          newCard.userDetails.watchingDate = getFullFormatDate(new Date()).toString();
        }

        break;
      case NewCardType.NEW_COMMENT:
        newCard.comments.push(update);
        break;
      case NewCardType.DELETE_COMMENT:
        newCard.comments.splice(update, 1);
        break;
    }

    return newCard;
  }

  #handleAddToWatchListCardClick = () => {
    // if (this.#mode === Mode.OPENING) {
    //   this.#handleAddToWatchListPopupClick();
    //   return;
    // }
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      this.#createNewCard(NewCardType.USER_DETAILS, UserDetailsUpdateType.WATCH_LIST),
    );
  }

  #handleMarkAsWatchedCardClick = () => {
    // if (this.#mode === Mode.OPENING) {
    //   this.#handleMarkAsWatchedPopupClick();
    //   return;
    // }
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      this.#createNewCard(NewCardType.USER_DETAILS, UserDetailsUpdateType.ALREADY_WATCHED),
    );
  }

  #handleFavoriteCardClick = () => {
    // if (this.#mode === Mode.OPENING) {
    //   this.#handleFavoritePopupClick();
    //   return;
    // }
    this.#updateMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      this.#createNewCard(NewCardType.USER_DETAILS, UserDetailsUpdateType.FAVORITE),
    );
  }

  // #handleAddToWatchListPopupClick = () => {
  //   this.resetView();
  //   this.#updateMovie(
  //     UserAction.UPDATE_MOVIE,
  //     UpdateType.MINOR_POPUP,
  //     this.#createNewCard(NewCardType.USER_DETAILS, UserDetailsUpdateType.WATCH_LIST),
  //   );
  // }

  // #handleMarkAsWatchedPopupClick = () => {
  //   this.resetView();
  //   this.#updateMovie(
  //     UserAction.UPDATE_MOVIE,
  //     UpdateType.MINOR_POPUP,
  //     this.#createNewCard(NewCardType.USER_DETAILS, UserDetailsUpdateType.ALREADY_WATCHED),
  //   );
  // }

  // #handleFavoritePopupClick = () => {
  //   this.resetView();
  //   this.#updateMovie(
  //     UserAction.UPDATE_MOVIE,
  //     UpdateType.MINOR_POPUP,
  //     this.#createNewCard(NewCardType.USER_DETAILS, UserDetailsUpdateType.FAVORITE),
  //   );
  // }

  // #handleAddNewCommentKeydown = (newComment) => {
  //   this.resetView();
  //   this.#updateMovie(
  //     UserAction.UPDATE_MOVIE,
  //     UpdateType.PATCH,
  //     this.#createNewCard(NewCardType.NEW_COMMENT, newComment),
  //   );
  // }

  // #handleDeleteCommentClick = (commentId) => {
  //   const indexDeletedComment = this.#card.comments.findIndex(({id}) => id === commentId);
  //   this.resetView();
  //   this.#updateMovie(
  //     UserAction.UPDATE_MOVIE,
  //     UpdateType.PATCH,
  //     this.#createNewCard(NewCardType.DELETE_COMMENT, indexDeletedComment),
  //   );
  // }
}
