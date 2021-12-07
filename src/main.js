import {RenderPosition, render, remove} from './utils/render.js';

import RankView from './view/rank-view.js';
import QuantityFilmsView from './view/quantity-films-view.js';

import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';

import FilmsContainerView from './view/films-container-view.js';
import FilmsListView from './view/films-list-view.js';
import FilmCardView from './view/film-card-view.js';

import ButtonShowMoreView from './view/button-show-more-view.js';

import PopupView from './view/popup-view.js';
import PopupFilmDetailsView from './view/popup-film-details-view.js';
import PopupCommentsListView from './view/popup-comments-list-view.js';
import PopupCommentView from './view/popup-comment-view.js';
import PopupNewCommentView from './view/popup-new-comment-view.js';

import FilmsListEmptyView from './view/films-list-empty-view.js';

import {generateMovie} from './mock/movie.js';
import {generateFilter} from './mock/filter.js';

const FILM_COUNT = 23;
const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA = 2;

const FilmsListTitles = {
  COMMON: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const renderCard = (filmsListElement, card) => {
  const cardComponent = new FilmCardView(card);

  const popupComponent = new PopupView();
  const popupFilmDetailsComponent = new PopupFilmDetailsView(card);
  const popupCommentsListComponent = new PopupCommentsListView(card);
  const popupCommentComponents = card.comments.map((comment) => new PopupCommentView(comment));
  const popupNewCommentComponent = new PopupNewCommentView();

  const onCloseButtonClick = () => {
    document.body.classList.remove('hide-overflow');
    remove(popupNewCommentComponent);
    popupCommentComponents.forEach((component) => remove(component));
    remove(popupCommentsListComponent);
    remove(popupFilmDetailsComponent);
    remove(popupComponent);
  };

  const onFilmCardClick = () => {
    render(siteFooterElement, popupComponent, RenderPosition.AFTEREND);
    const filmDetails = popupComponent.element.querySelector('.film-details__inner');
    render(filmDetails, popupFilmDetailsComponent, RenderPosition.AFTERBEGIN);
    render(filmDetails, popupCommentsListComponent, RenderPosition.BEFOREEND);
    const commentsList = popupCommentsListComponent.element.querySelector('.film-details__comments-list');
    popupCommentComponents.forEach((component) => render(commentsList, component, RenderPosition.BEFOREEND));
    render(commentsList, popupNewCommentComponent, RenderPosition.AFTEREND);
    document.body.classList.add('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      onCloseButtonClick();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  cardComponent.setOpenPopupClickHandler(() => {
    onFilmCardClick();
    document.addEventListener('keydown', onEscKeyDown);
    popupFilmDetailsComponent.setClosePopupClickHandler(() => {
      onCloseButtonClick();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  });

  render(filmsListElement, cardComponent, RenderPosition.BEFOREEND);
};

const renderFilmsCardLists = (filmsContainerElement, cardsFilm) => {
  if (cardsFilm.length === 0) {
    render(filmsContainerElement, new FilmsListEmptyView(), RenderPosition.BEFOREEND);
    return;
  }

  const filmsListCommon = new FilmsListView(FilmsListTitles.COMMON);
  render(filmsContainerElement, filmsListCommon, RenderPosition.BEFOREEND);

  const filmsListCommonContainer = filmsListCommon.element.querySelector('.films-list__container');

  cardsFilm
    .slice(0, Math.min(cardsFilm.length, FILM_COUNT_PER_STEP))
    .forEach((card) => renderCard(filmsListCommonContainer, card));

  if (cardsFilm.length > FILM_COUNT_PER_STEP) {
    const showMoreButtonComponent = new ButtonShowMoreView();
    render(filmsListCommon, showMoreButtonComponent, RenderPosition.BEFOREEND);

    let renderedCardCount = FILM_COUNT_PER_STEP;
    const onShowMoreButtonClick = () => {
      cardsFilm
        .slice(renderedCardCount, renderedCardCount + FILM_COUNT_PER_STEP)
        .forEach((card) => renderCard(filmsListCommonContainer, card));

      renderedCardCount += FILM_COUNT_PER_STEP;

      if (renderedCardCount >= cardsFilm.length) {
        remove(showMoreButtonComponent);
      }
    };

    showMoreButtonComponent.setClickHandler(onShowMoreButtonClick);
  }

  // Список фильмов Top Rated

  const filmsListTopRated = new FilmsListView(FilmsListTitles.TOP_RATED, true);
  render(filmsContainerElement, filmsListTopRated, RenderPosition.BEFOREEND);

  const filmsListTopRatedContainer = filmsListTopRated.element.querySelector('.films-list__container');

  cardsFilm
    .slice(0, FILM_COUNT_EXTRA)
    .forEach((card) => renderCard(filmsListTopRatedContainer, card));

  // Список фильмов Most Commented

  const filmsListMostCommented = new FilmsListView(FilmsListTitles.MOST_COMMENTED, true);
  render(filmsContainerElement, filmsListMostCommented, RenderPosition.BEFOREEND);

  const filmsListMostCommentedContainer = filmsListMostCommented.element.querySelector('.films-list__container');

  cardsFilm
    .slice(0, FILM_COUNT_EXTRA)
    .forEach((card) => renderCard(filmsListMostCommentedContainer, card));

};

const cards = Array.from( {length: FILM_COUNT}, generateMovie );
const filters = generateFilter(cards);

// Звание и кол-во фильмов в сервисе

render(siteHeaderElement, new RankView(cards), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new QuantityFilmsView(cards), RenderPosition.AFTERBEGIN);

// Сортировка и фильтры

render(siteMainElement, new SortView(), RenderPosition.AFTERBEGIN);
render(siteMainElement, new FiltersView(filters), RenderPosition.AFTERBEGIN);

// Список фильмов Common и кнопка ShowMore

const filmsContainer = new FilmsContainerView();
render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);

renderFilmsCardLists(filmsContainer.element, cards);
