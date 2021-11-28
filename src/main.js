import {renderTemplate, RenderPosition} from './render.js';
import {createRankTemplate, createQuantityFilmsTemplate} from './view/common-container-view.js';
import {createFilterTemplate} from './view/filter-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createFilmListTemplate, createFilmCardTemplate} from './view/film-list-view.js';
import {createButtonShowMoreTemplate} from './view/button-show-more-view.js';
import {createPopupTemplate, createCommentsListTemplate, createCommentTemplate, createNewCommentTemplate} from './view/popup-view.js';
import {generateMovie} from './mock/movie.js';

const FILM_COUNT = 20;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

// Звание и кол-во фильмов в сервисе

renderTemplate(siteHeaderElement, createRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footerStatisticsElement, createQuantityFilmsTemplate(), RenderPosition.AFTERBEGIN);

// Сортировка и фильтры

renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createFilterTemplate(), RenderPosition.AFTERBEGIN);

// Список фильмов

const cards = Array.from( {length: FILM_COUNT}, generateMovie );

renderTemplate(siteMainElement, createFilmListTemplate(), RenderPosition.BEFOREEND);

const filmList = siteMainElement.querySelector('.films-list');
const filmListContainer = filmList.querySelector('.films-list__container');

for (let i = 1; i < FILM_COUNT; i++) {
  renderTemplate(filmListContainer, createFilmCardTemplate(cards[i]), RenderPosition.BEFOREEND);
}

renderTemplate(filmListContainer, createButtonShowMoreTemplate(), RenderPosition.AFTEREND);

// Попап

renderTemplate(siteFooterElement, createPopupTemplate(cards[0]), RenderPosition.AFTEREND);

const popup = document.querySelector('.film-details');
const popupForm = popup.querySelector('.film-details__inner');

renderTemplate(popupForm, createCommentsListTemplate(cards[0]), RenderPosition.BEFOREEND);

const popupCommentList = popupForm.querySelector('.film-details__comments-list');

for (let i = 0; i < cards[0].comments.length; i++) {
  renderTemplate(popupCommentList, createCommentTemplate(cards[0].comments[i]), RenderPosition.BEFOREEND);
}

renderTemplate(popupCommentList, createNewCommentTemplate(), RenderPosition.AFTEREND);
