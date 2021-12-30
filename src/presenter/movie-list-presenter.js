import FilmsContainerView from '../view/films-container-view.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import FilmCardPresenter from './film-card-presetner.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {getDeepCopy, sortCardDate, sortCardRating, sortCardComments} from '../utils/common.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA = 2;

const FilmsListTitles = {
  COMMON: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class MovieListPresenter {
  #movieList = null;
  #moviesModel = null;
  #filterModel = null;

  #openPopupCard = null;
  #scrollPopupY = 0;

  #sortComponent = null;
  #showMoreButtonComponent = null;
  #filmsListEmptyComponent = null;

  #filmsContainerComponent = new FilmsContainerView();

  #filmsListCommonComponent = new FilmsListView(FilmsListTitles.COMMON, false);
  #filmsListTopRatedComponent = new FilmsListView(FilmsListTitles.TOP_RATED, true);
  #filmsListMostCommentedComponent = new FilmsListView(FilmsListTitles.MOST_COMMENTED, true);

  #renderedCardCount = FILM_COUNT_PER_STEP;
  #filmCardPresenters = new Map();
  #filmCardTopRatedPresenters = new Map();
  #filmCardMostCommentedPresenters = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(movieList, moviesModel, filterModel) {
    this.#movieList = movieList;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const cards = getDeepCopy(this.#moviesModel.movies);
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
    return getDeepCopy(this.#moviesModel.movies).sort(sortCardRating);
  }

  get moviesMostCommented() {
    return getDeepCopy(this.#moviesModel.movies).sort(sortCardComments);
  }

  init = () => {
    this.#renderFilmsContainer();
  }

  #renderSort = () => {
    if (this.movies.length === 0) {
      return;
    }

    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#filmsContainerComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilmCard = (card) => {
    const filmCardsContainerElement = this.#filmsListCommonComponent.element.querySelector('.films-list__container');
    const filmCardPresenter = new FilmCardPresenter(filmCardsContainerElement, this.#handleViewAction, this.#handleOpenModeChange, this.#handleCloseModeChange);
    filmCardPresenter.init(card);
    this.#filmCardPresenters.set(card.id, filmCardPresenter);
  }

  #renderFilmCardTopRated = (card) => {
    const filmCardsContainerElement = this.#filmsListTopRatedComponent.element.querySelector('.films-list__container');
    const filmCardPresenter = new FilmCardPresenter(filmCardsContainerElement, this.#handleViewAction, this.#handleOpenModeChange, this.#handleCloseModeChange);
    filmCardPresenter.init(card);
    this.#filmCardTopRatedPresenters.set(card.id, filmCardPresenter);
  }

  #renderFilmCardMostCommented = (card) => {
    const filmCardsContainerElement = this.#filmsListMostCommentedComponent.element.querySelector('.films-list__container');
    const filmCardPresenter = new FilmCardPresenter(filmCardsContainerElement, this.#handleViewAction, this.#handleOpenModeChange, this.#handleCloseModeChange);
    filmCardPresenter.init(card);
    this.#filmCardMostCommentedPresenters.set(card.id, filmCardPresenter);
  }

  #renderFilmCards = (cards) => {
    cards.forEach((card) => this.#renderFilmCard(card));
  }

  #renderFilmCardsTopRated = (cards) => {
    cards.forEach((card) => this.#renderFilmCardTopRated(card));
  }

  #renderFilmCardsMostCommented = (cards) => {
    cards.forEach((card) => this.#renderFilmCardMostCommented(card));
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
    const cards = this.movies;
    const cardsCount = cards.length;

    if (cardsCount === 0) {
      this.#renderFilmsListEmpty();
      return;
    }

    this.#renderFilmCards(cards.slice(0, Math.min(cardsCount, this.#renderedCardCount)));

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

    this.#renderFilmCardsTopRated(cards);
    render(this.#filmsContainerComponent, this.#filmsListTopRatedComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListMostCommented = () => {
    if (this.moviesMostCommented.every( ({comments}) => comments.length === 0 )) {
      return;
    }

    const cards = this.moviesMostCommented.slice(0, FILM_COUNT_EXTRA);

    this.#renderFilmCardsMostCommented(cards);
    render(this.#filmsContainerComponent, this.#filmsListMostCommentedComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsLists = () => {
    this.#renderFilmsListCommon();
    this.#renderFilmsListTopRated();
    this.#renderFilmsListMostCommented();
  }

  #clearBoard = ({resetRenderedCardCount = false, resetSortType = false} = {}) => {
    const cardsCount = this.movies.length;

    this.#clearFilmsLists();

    remove(this.#sortComponent);

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

  #renderBoard = () => {
    this.#renderSort();
    this.#renderFilmsLists();
  }

  #clearFilmsLists = () => {
    this.#clearFilmsListCommon();
    this.#clearFilmsListTopRated();
    this.#clearFilmsListMostCommented();
  }

  #clearFilmsListCommon = () => {
    this.#filmCardPresenters.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenters.clear();
  }

  #clearFilmsListTopRated = () => {
    this.#filmCardTopRatedPresenters.forEach((presenter) => presenter.destroy());
    this.#filmCardTopRatedPresenters.clear();
  }

  #clearFilmsListMostCommented = () => {
    this.#filmCardMostCommentedPresenters.forEach((presenter) => presenter.destroy());
    this.#filmCardMostCommentedPresenters.clear();
  }

  #renderFilmsContainer = () => {
    render(this.#movieList, this.#filmsContainerComponent, RenderPosition.BEFOREEND);
    this.#renderBoard();
  }

  #handleShowMoreButtonClick = () => {
    const cardsCount = this.movies.length;
    const newRenderedCardsCount = Math.min(cardsCount, this.#renderedCardCount + FILM_COUNT_PER_STEP);
    const cards = this.movies.slice(this.#renderedCardCount, newRenderedCardsCount);

    this.#renderFilmCards(cards);

    this.#renderedCardCount = newRenderedCardsCount;

    if (this.#renderedCardCount >= cardsCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #handleCardChange = (updatedCard) => {
    const filmCardPresenter = this.#filmCardPresenters.get(updatedCard.id);
    const filmCardTopRatedPresenter = this.#filmCardTopRatedPresenters.get(updatedCard.id);
    const filmCardMostCommentedPresenter = this.#filmCardMostCommentedPresenters.get(updatedCard.id);

    if (filmCardPresenter !== undefined) {
      filmCardPresenter.init(updatedCard);
    }
    if (filmCardTopRatedPresenter !== undefined) {
      filmCardTopRatedPresenter.init(updatedCard);
    }
    if (filmCardMostCommentedPresenter !== undefined) {
      filmCardMostCommentedPresenter.init(updatedCard);
    }
  }

  #handleOpenPopup = (updatedCard) => {
    const filmCardPresenter = this.#filmCardPresenters.get(updatedCard.id);
    const filmCardTopRatedPresenter = this.#filmCardTopRatedPresenters.get(updatedCard.id);
    const filmCardMostCommentedPresenter = this.#filmCardMostCommentedPresenters.get(updatedCard.id);

    if (filmCardPresenter !== undefined) {
      filmCardPresenter.handleOpenPopupClick();
      filmCardPresenter.scrollPopup(this.#scrollPopupY);
    } else if (filmCardTopRatedPresenter !== undefined) {
      filmCardTopRatedPresenter.handleOpenPopupClick();
      filmCardTopRatedPresenter.scrollPopup(this.#scrollPopupY);
    } else if (filmCardMostCommentedPresenter !== undefined) {
      filmCardMostCommentedPresenter.handleOpenPopupClick();
      filmCardMostCommentedPresenter.scrollPopup(this.#scrollPopupY);
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handleCardChange(data);
        this.#clearFilmsListMostCommented();
        this.#renderFilmsListMostCommented();
        this.#handleOpenPopup(this.#openPopupCard);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MINOR_POPUP:
        this.#clearBoard();
        this.#renderBoard();
        this.#handleOpenPopup(this.#openPopupCard);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCardCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  }

  #handleOpenModeChange = (card) => {
    this.#filmCardPresenters.forEach((presenter) => presenter.resetView());
    this.#filmCardTopRatedPresenters.forEach((presenter) => presenter.resetView());
    this.#filmCardMostCommentedPresenters.forEach((presenter) => presenter.resetView());
    this.#openPopupCard = card;
  }

  #handleCloseModeChange = (scroll) => {
    this.#scrollPopupY = scroll;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleOpenModeChange();
    this.#clearBoard({resetRenderedCardCount: true});
    this.#renderBoard();
  }
}
