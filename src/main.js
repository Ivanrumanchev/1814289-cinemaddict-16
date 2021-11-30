import {renderTemplate, RenderPosition} from './render.js';

import {createRankTemplate} from './view/rank-view.js';
import {createQuantityFilmsTemplate} from './view/quantity-films-view.js';

import {createFiltersTemplate} from './view/filter-view.js';
import {createSortTemplate} from './view/sort-view.js';

import {createFilmsContainerTemplate} from './view/films-container-view.js';
import {createFilmListTemplate} from './view/films-list-view.js';
import {createFilmCardsTemplate} from './view/film-cards-view.js';

import {createButtonShowMoreTemplate} from './view/button-show-more-view.js';

import {createPopupTemplate} from './view/popup-view.js';
import {createFilmDetailsTemplate} from './view/popup-film-details-view.js';
import {createCommentsListTemplate} from './view/popup-comments-view.js';

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

const cards = Array.from( {length: FILM_COUNT}, generateMovie );
const filters = generateFilter(cards);

// Звание и кол-во фильмов в сервисе

renderTemplate(siteHeaderElement, createRankTemplate(cards), RenderPosition.BEFOREEND);
renderTemplate(footerStatisticsElement, createQuantityFilmsTemplate(cards), RenderPosition.AFTERBEGIN);

// Сортировка и фильтры

renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createFiltersTemplate(filters), RenderPosition.AFTERBEGIN);

// Список фильмов Common и кнопка ShowMore

renderTemplate(siteMainElement, createFilmsContainerTemplate(), RenderPosition.BEFOREEND);

const filmsContainer = siteMainElement.querySelector('.films');

renderTemplate(filmsContainer, createFilmListTemplate(FilmsListTitles.COMMON), RenderPosition.BEFOREEND);

const filmsListCommon = filmsContainer.querySelector('.films-list');
const filmsListCommonContainer = filmsListCommon.querySelector('.films-list__container');

let cardsForRender = cards.slice(0, Math.min(cards.length, FILM_COUNT_PER_STEP));
renderTemplate(filmsListCommonContainer, createFilmCardsTemplate(cardsForRender), RenderPosition.BEFOREEND);

if (cards.length > FILM_COUNT_PER_STEP) {
  renderTemplate(filmsListCommon, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

  const showMoreButton = filmsListCommon.querySelector('.films-list__show-more');

  let renderedCardCount = FILM_COUNT_PER_STEP;
  const onShowMoreButtonClick = () => {
    cardsForRender = cards.slice(renderedCardCount, renderedCardCount + FILM_COUNT_PER_STEP);

    renderTemplate(filmsListCommonContainer, createFilmCardsTemplate(cardsForRender), RenderPosition.BEFOREEND);

    renderedCardCount += FILM_COUNT_PER_STEP;

    if (renderedCardCount >= cards.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener('click', onShowMoreButtonClick);
}

// Список фильмов Top Rated

renderTemplate(filmsContainer, createFilmListTemplate(FilmsListTitles.TOP_RATED, true), RenderPosition.BEFOREEND);

const filmsListTopRated = filmsContainer.querySelectorAll('.films-list--extra')[0];
const filmsListTopRatedContainer = filmsListTopRated.querySelector('.films-list__container');

renderTemplate(filmsListTopRatedContainer, createFilmCardsTemplate(cards.slice(0, FILM_COUNT_EXTRA)), RenderPosition.BEFOREEND);

// Список фильмов Most Commented

renderTemplate(filmsContainer, createFilmListTemplate(FilmsListTitles.MOST_COMMENTED, true), RenderPosition.BEFOREEND);

const filmsListMostCommented = filmsContainer.querySelectorAll('.films-list--extra')[1];
const filmsListMostCommentedContainer = filmsListMostCommented.querySelector('.films-list__container');

renderTemplate(filmsListMostCommentedContainer, createFilmCardsTemplate(cards.slice(0, FILM_COUNT_EXTRA)), RenderPosition.BEFOREEND);

// Попап

renderTemplate(siteFooterElement, createPopupTemplate(), RenderPosition.AFTEREND);
const popup = document.querySelector('.film-details');
const filmDetails = popup.querySelector('.film-details__inner');
renderTemplate(filmDetails, createFilmDetailsTemplate(cards[0]), RenderPosition.AFTERBEGIN);
renderTemplate(filmDetails, createCommentsListTemplate(cards[0]), RenderPosition.BEFOREEND);
