import {renderTemplate, RenderPosition} from './render.js';
import {createRankTemplate, createQuantityFilmsTemplate} from './view/common-container-view.js';
import {createFiltersTemplate} from './view/filter-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createFilmListTemplate, createFilmCardsTemplate} from './view/film-list-view.js';
import {createButtonShowMoreTemplate} from './view/button-show-more-view.js';
import {createPopupTemplate} from './view/popup-view.js';
import {generateMovie} from './mock/movie.js';
import {generateFilter} from './mock/filter.js';

const FILM_COUNT = 23;
const FILM_COUNT_PER_STEP = 5;

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

// Список фильмов и кнопка ShowMore

renderTemplate(siteMainElement, createFilmListTemplate( cards.slice(0, Math.min(cards.length, FILM_COUNT_PER_STEP)) ), RenderPosition.BEFOREEND);

const filmsList = siteMainElement.querySelector('.films-list');
const filmsListContainer = filmsList.querySelector('.films-list__container');

if (cards.length > FILM_COUNT_PER_STEP) {
  let renderedCardCount = FILM_COUNT_PER_STEP;

  renderTemplate(filmsList, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

  const showMoreButton = filmsList.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    const cardsForRender = cards.slice(renderedCardCount, renderedCardCount + FILM_COUNT_PER_STEP);

    renderTemplate(filmsListContainer, createFilmCardsTemplate(cardsForRender), RenderPosition.BEFOREEND);

    renderedCardCount += FILM_COUNT_PER_STEP;

    if (renderedCardCount >= cards.length) {
      showMoreButton.remove();
    }
  });
}

// Попап

renderTemplate(siteFooterElement, createPopupTemplate(cards[0]), RenderPosition.AFTEREND);

