import {RenderPosition, render} from './utils/render.js';

import RankView from './view/rank-view.js';
import QuantityFilmsView from './view/quantity-films-view.js';

import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';

import FilmsContainerView from './view/films-container-view.js';

import {generateMovie} from './mock/movie.js';
import {generateFilter} from './mock/filter.js';

const FILM_COUNT = 23;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const cards = Array.from( {length: FILM_COUNT}, generateMovie );
const filters = generateFilter(cards);

// Звание и кол-во фильмов в сервисе

render(siteHeaderElement, new RankView(cards), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new QuantityFilmsView(cards), RenderPosition.AFTERBEGIN);

// Сортировка и фильтры

render(siteMainElement, new SortView(), RenderPosition.AFTERBEGIN);
render(siteMainElement, new FiltersView(filters), RenderPosition.AFTERBEGIN);

// Список фильмов Common и кнопка ShowMore

const filmsContainer = new FilmsContainerView(cards);
filmsContainer.init();
render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);
