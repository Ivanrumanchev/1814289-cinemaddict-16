import FilmsContainerView from '../view/films-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import FilmCardPresenter from './film-card-presetner.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA = 2;

const FilmsListTitles = {
  COMMON: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class FilmsContainerPresenter {
  #movieList = null;

  #filmsContainerComponent = new FilmsContainerView();
  #filmsListEmptyComponent = new FilmsListEmptyView();

  #filmsListCommonComponent = new FilmsListView(FilmsListTitles.COMMON, false);
  #filmsListTopRatedComponent = new FilmsListView(FilmsListTitles.TOP_RATED, true);
  #filmsListMostCommentedComponent = new FilmsListView(FilmsListTitles.MOST_COMMENTED, true);

  #showMoreButtonComponent = new ButtonShowMoreView();

  #filmCards = [];
  #renderedCardCount = FILM_COUNT_PER_STEP;
  #filmCardPresenters = new Map();
  #filmCardTopRatedPresenters = new Map();
  #filmCardMostCommentedPresenters = new Map();

  constructor(movieList) {
    this.#movieList = movieList;
  }

  init = (filmCards) => {
    this.#filmCards = [...filmCards];
    render(this.#movieList, this.#filmsContainerComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsLists();
  }

  #handleCardChange = (updatedCard) => {
    const filmCardPresenter = this.#filmCardPresenters.get(updatedCard.id);
    const filmCardTopRatedPresenter = this.#filmCardTopRatedPresenters.get(updatedCard.id);
    const filmCardMostCommentedPresenter = this.#filmCardMostCommentedPresenters.get(updatedCard.id);

    this.#filmCards = updateItem(this.#filmCards, updatedCard);

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

  #renderFilmCard = (filmsListElement, card) => {
    const filmCardPresenter = new FilmCardPresenter(filmsListElement, this.#handleCardChange, this.#handleModeChange);
    filmCardPresenter.init(card);
    this.#filmCardPresenters.set(card.id, filmCardPresenter);
  }

  #renderFilmCardTopRated = (filmsListElement, card) => {
    const filmCardPresenter = new FilmCardPresenter(filmsListElement, this.#handleCardChange, this.#handleModeChange);
    filmCardPresenter.init(card);
    this.#filmCardTopRatedPresenters.set(card.id, filmCardPresenter);
  }

  #renderFilmCardMostCommented = (filmsListElement, card) => {
    const filmCardPresenter = new FilmCardPresenter(filmsListElement, this.#handleCardChange, this.#handleModeChange);
    filmCardPresenter.init(card);
    this.#filmCardMostCommentedPresenters.set(card.id, filmCardPresenter);
  }

  #renderFilmCards = (container, from, to) => {
    const filmsListElement = container.element.querySelector('.films-list__container');
    this.#filmCards
      .slice(from, to)
      .forEach((card) => this.#renderFilmCard(filmsListElement, card));
  }

  #renderFilmCardsTopRated = (container, sortedCards) => {
    const filmsListElement = container.element.querySelector('.films-list__container');
    sortedCards
      .slice(0, FILM_COUNT_EXTRA)
      .forEach((card) => this.#renderFilmCardTopRated(filmsListElement, card));
  }

  #renderFilmCardsMostCommented = (container, sortedCards) => {
    const filmsListElement = container.element.querySelector('.films-list__container');
    sortedCards
      .slice(0, FILM_COUNT_EXTRA)
      .forEach((card) => this.#renderFilmCardMostCommented(filmsListElement, card));
  }

  #renderFilmsListCommon = () => {
    render(this.#filmsContainerComponent, this.#filmsListCommonComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListTopRated = () => {
    render(this.#filmsContainerComponent, this.#filmsListTopRatedComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListMostCommented = () => {
    render(this.#filmsContainerComponent, this.#filmsListMostCommentedComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListEmpty = () => {
    render(this.#filmsContainerComponent, this.#filmsListEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListCommonComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #clearFilmsList = () => {
    this.#filmCardPresenters.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenters.clear();
    this.#renderedCardCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderFilmsLists = () => {
    if (this.#filmCards.length === 0) {
      this.#renderFilmsListEmpty();
      return;
    }
    // Список фильмов Common + ShowMoreButton
    this.#renderFilmCards(this.#filmsListCommonComponent, 0, Math.min(this.#filmCards.length, FILM_COUNT_PER_STEP));
    if (this.#filmCards.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
    this.#renderFilmsListCommon();
    // Список фильмов Top Rated
    this.#renderFilmCardsTopRated(this.#filmsListTopRatedComponent, this.#filmCards);
    this.#renderFilmsListTopRated();
    // Список фильмов Most Commented
    this.#renderFilmCardsMostCommented(this.#filmsListMostCommentedComponent, this.#filmCards);
    this.#renderFilmsListMostCommented();
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilmCards(this.#filmsListCommonComponent, this.#renderedCardCount, this.#renderedCardCount + FILM_COUNT_PER_STEP);
    this.#renderedCardCount += FILM_COUNT_PER_STEP;

    if (this.#renderedCardCount >= this.#filmCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #handleModeChange = () => {
    this.#filmCardPresenters.forEach((presenter) => presenter.resetView());
    this.#filmCardTopRatedPresenters.forEach((presenter) => presenter.resetView());
    this.#filmCardMostCommentedPresenters.forEach((presenter) => presenter.resetView());
  }
}
