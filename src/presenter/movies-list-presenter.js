import FilmsContainerView from '../view/films-container-view.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import CardPresenter from './card-presenter.js';
import PopupPresenter from './popup-presenter.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import StatisticsView from '../view/statistics-view.js';
import LoadingView from '../view/loading-view.js';
import QuantityFilmsView from '../view/quantity-films-view.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {sortCardDate, sortCardRating, sortCardComments} from '../utils/common.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import {showAlert} from '../utils/loading.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA = 2;

const FilmsListTitles = {
  COMMON: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const loadingComments = [{
  comment: 'Loading...',
  emotion: 'sleeping',
  loading: true,
}];

export default class MoviesListPresenter {
  #movieList = null;
  #footerStatistics = null;
  #moviesModel = null;
  #filterModel = null;
  #commentsModel = null;

  #openPopupCard = null;

  #sortComponent = null;
  #showMoreButtonComponent = null;
  #filmsListEmptyComponent = null;

  #filmsContainerComponent = null;

  #popupPresenter = null;

  #statisticsComponent = null;
  #quantityFilmsComponent = null;

  #loadingComponent = new LoadingView();

  #filmsListCommonComponent = new FilmsListView(FilmsListTitles.COMMON, false);
  #filmsListTopRatedComponent = new FilmsListView(FilmsListTitles.TOP_RATED, true);
  #filmsListMostCommentedComponent = new FilmsListView(FilmsListTitles.MOST_COMMENTED, true);

  #renderedCardCount = FILM_COUNT_PER_STEP;
  #cardPresenters = new Map();
  #cardTopRatedPresenters = new Map();
  #cardMostCommentedPresenters = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #statisticsMode = false;

  constructor(movieList, moviesModel, filterModel, commentsModel, footerStatistics) {
    this.#movieList = movieList;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
    this.#footerStatistics = footerStatistics;
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const cards = this.#moviesModel.movies;
    const filteredCards = filter[this.#filterType](cards);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredCards.sort(sortCardDate);
      case SortType.RATING:
        return filteredCards.sort(sortCardRating);
    }

    return filteredCards;
  }

  get moviesTopRated() {
    const cards = this.#moviesModel.movies;
    const filteredCards = filter[FilterType.ALL](cards);
    return filteredCards.sort(sortCardRating);
  }

  get moviesMostCommented() {
    const cards = this.#moviesModel.movies;
    const filteredCards = filter[FilterType.ALL](cards);
    return filteredCards.sort(sortCardComments);
  }

  init = () => {
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#popupPresenter = new PopupPresenter(this.#handleViewMovieAction, this.#handleViewPopupAction);

    this.#renderFilmsContainer();
  }

  #renderFooterStatistics = (quantity) => {
    this.#quantityFilmsComponent = new QuantityFilmsView(quantity);
    render(this.#footerStatistics, this.#quantityFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  #renderSort = () => {
    if (this.movies.length === 0) {
      return;
    }

    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#filmsContainerComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderCard = (card) => {
    const cardsContainerElement = this.#filmsListCommonComponent.element.querySelector('.films-list__container');
    const cardPresenter = new CardPresenter(cardsContainerElement, this.#handleViewMovieAction, this.#setOpenPopupCard, this.#handleOpenPopupClick);
    cardPresenter.init(card);
    this.#cardPresenters.set(card.id, cardPresenter);
  }

  #renderCardTopRated = (card) => {
    const cardsContainerElement = this.#filmsListTopRatedComponent.element.querySelector('.films-list__container');
    const cardPresenter = new CardPresenter(cardsContainerElement, this.#handleViewMovieAction, this.#setOpenPopupCard, this.#handleOpenPopupClick);
    cardPresenter.init(card);
    this.#cardTopRatedPresenters.set(card.id, cardPresenter);
  }

  #renderCardMostCommented = (card) => {
    const cardsContainerElement = this.#filmsListMostCommentedComponent.element.querySelector('.films-list__container');
    const cardPresenter = new CardPresenter(cardsContainerElement, this.#handleViewMovieAction, this.#setOpenPopupCard, this.#handleOpenPopupClick);
    cardPresenter.init(card);
    this.#cardMostCommentedPresenters.set(card.id, cardPresenter);
  }

  #renderCards = (cards) => {
    cards.forEach((card) => this.#renderCard(card));
  }

  #renderCardsTopRated = (cards) => {
    cards.forEach((card) => this.#renderCardTopRated(card));
  }

  #renderCardsMostCommented = (cards) => {
    cards.forEach((card) => this.#renderCardMostCommented(card));
  }

  #renderLoading = () => {
    render(this.#filmsContainerComponent, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListEmpty = () => {
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filterType);
    render(this.#filmsContainerComponent, this.#filmsListEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ButtonShowMoreView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#filmsListCommonComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListCommon = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      this.#renderFooterStatistics(0);
      return;
    }

    const cards = this.movies;
    const cardsCount = cards.length;

    if (cardsCount === 0) {
      this.#renderFilmsListEmpty();
      return;
    }

    this.#renderCards(cards.slice(0, Math.min(cardsCount, this.#renderedCardCount)));

    if (cardsCount > this.#renderedCardCount) {
      this.#renderShowMoreButton();
    }

    render(this.#filmsContainerComponent, this.#filmsListCommonComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListTopRated = () => {
    if (this.moviesTopRated.every( ({filmInfo}) => filmInfo.totalRating === 0 )) {
      return;
    }

    const cards = this.moviesTopRated.slice(0, FILM_COUNT_EXTRA);

    this.#renderCardsTopRated(cards);
    render(this.#filmsContainerComponent, this.#filmsListTopRatedComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListMostCommented = () => {
    if (this.moviesMostCommented.every( ({comments}) => comments.length === 0 )) {
      return;
    }

    const cards = this.moviesMostCommented.slice(0, FILM_COUNT_EXTRA);

    this.#renderCardsMostCommented(cards);
    render(this.#filmsContainerComponent, this.#filmsListMostCommentedComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsLists = () => {
    this.#renderFilmsListCommon();
    this.#renderFilmsListTopRated();
    this.#renderFilmsListMostCommented();
  }

  #renderBoard = () => {
    this.#renderSort();
    this.#renderFilmsLists();
  }

  #renderFilmsContainer = () => {
    this.#moviesModel.addObserver(this.#handleModelEvent);

    this.#filmsContainerComponent = new FilmsContainerView();
    render(this.#movieList, this.#filmsContainerComponent, RenderPosition.BEFOREEND);
    this.#renderBoard();
  }

  #clearFilmsContainer = () => {
    this.#moviesModel.removeObserver(this.#handleModelEvent);

    remove(this.#filmsContainerComponent);
    this.#clearBoard({resetRenderedCardCount: true, resetSortType: true});
  }

  #clearBoard = ({resetRenderedCardCount = false, resetSortType = false} = {}) => {
    const cardsCount = this.movies.length;

    this.#clearFilmsLists();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    if (resetRenderedCardCount) {
      this.#renderedCardCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedCardCount = Math.min(cardsCount, this.#renderedCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #clearFilmsLists = () => {
    this.#clearFilmsListCommon();
    this.#clearFilmsListTopRated();
    this.#clearFilmsListMostCommented();
  }

  #clearFilmsListCommon = () => {
    this.#cardPresenters.forEach((presenter) => presenter.destroy());
    this.#cardPresenters.clear();
    remove(this.#filmsListCommonComponent);
  }

  #clearFilmsListTopRated = () => {
    this.#cardTopRatedPresenters.forEach((presenter) => presenter.destroy());
    this.#cardTopRatedPresenters.clear();
    remove(this.#filmsListTopRatedComponent);
  }

  #clearFilmsListMostCommented = () => {
    this.#cardMostCommentedPresenters.forEach((presenter) => presenter.destroy());
    this.#cardMostCommentedPresenters.clear();
    remove(this.#filmsListMostCommentedComponent);
  }

  #handleShowMoreButtonClick = () => {
    const cardsCount = this.movies.length;
    const newRenderedCardsCount = Math.min(cardsCount, this.#renderedCardCount + FILM_COUNT_PER_STEP);
    const cards = this.movies.slice(this.#renderedCardCount, newRenderedCardsCount);

    this.#renderCards(cards);

    this.#renderedCardCount = newRenderedCardsCount;

    if (this.#renderedCardCount >= cardsCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #handleCardChange = (updatedCard) => {
    const cardPresenter = this.#cardPresenters.get(updatedCard.id);
    const cardTopRatedPresenter = this.#cardTopRatedPresenters.get(updatedCard.id);
    const cardMostCommentedPresenter = this.#cardMostCommentedPresenters.get(updatedCard.id);

    if (cardPresenter !== undefined) {
      cardPresenter.init(updatedCard);
    }
    if (cardTopRatedPresenter !== undefined) {
      cardTopRatedPresenter.init(updatedCard);
    }
    if (cardMostCommentedPresenter !== undefined) {
      cardMostCommentedPresenter.init(updatedCard);
    }
  }

  #handleOpenPopupClick = () => {
    this.#commentsModel.addObserver(this.#handleModelPopupEvent);
    this.#popupPresenter.resetView();

    this.#popupPresenter.init(this.#openPopupCard, loadingComments);
    this.#commentsModel.init(this.#openPopupCard);
  }

  #handleViewPopupAction = async (actionType, updateType, comment, movie) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#popupPresenter.setSavingState();

        try {
          await this.#commentsModel.addComment(updateType, comment, movie);
        } catch(err) {
          showAlert(err);
          this.#popupPresenter.resetSavingState();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupPresenter.setDeletingState(comment);

        try {
          await this.#commentsModel.deleteComment(updateType, comment);
        } catch(err) {
          showAlert(err);
          this.#popupPresenter.resetDeletingState(comment);
        }
        break;
    }
  }

  #handleModelPopupEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#popupPresenter.reInitComments(this.#commentsModel.comments);
        break;
      case UpdateType.PATCH:
        this.#openPopupCard.comments = this.#commentsModel.comments.map((comment) => comment.id);

        this.#handleCardChange(this.#openPopupCard);
        this.#clearFilmsListMostCommented();
        this.#renderFilmsListMostCommented();

        this.#popupPresenter.resetNewComment();
        this.#popupPresenter.setOpenCard(this.#openPopupCard);
        this.#popupPresenter.reInitComments(this.#commentsModel.comments);
        break;
    }
  }

  #setOpenPopupCard = (card) => {
    this.#openPopupCard = card;
  }

  #handleViewMovieAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MINOR_POPUP:
        this.#clearBoard();
        this.#renderBoard();

        this.#popupPresenter.setOpenCard(data);
        this.#setOpenPopupCard(data);
        this.#popupPresenter.reInitControlButtons(data);
        break;
      case UpdateType.MAJOR:
        if (this.#statisticsMode) {
          this.#statisticsMode = false;
          remove(this.#statisticsComponent);
        }

        this.#clearFilmsContainer();
        this.#renderFilmsContainer();
        break;
      case UpdateType.DESTROY:
        this.#statisticsMode = true;

        this.#clearFilmsContainer();

        this.#statisticsComponent = new StatisticsView(this.movies);
        render(this.#movieList, this.#statisticsComponent, RenderPosition.BEFOREEND);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmsContainer();
        remove(this.#quantityFilmsComponent);
        this.#renderFooterStatistics(this.movies.length);
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedCardCount: true});
    this.#renderBoard();
  }
}
