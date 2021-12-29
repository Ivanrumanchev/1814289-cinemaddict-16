import {RenderPosition, render} from './utils/render.js';

import RankView from './view/rank-view.js';
import QuantityFilmsView from './view/quantity-films-view.js';

import FiltersView from './view/filters-view.js';

import MovieListPresenter from './presenter/movie-list-presenter.js';

import MoviesModel from './model/movies-model.js';

import {generateMovie} from './mock/movie.js';
import {generateFilter} from './mock/filter.js';

const FILM_COUNT = 5;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const cards = Array.from( {length: FILM_COUNT}, generateMovie );
const filters = generateFilter(cards);

const moviesModel = new MoviesModel();
moviesModel.movies = cards;

// Звание и кол-во фильмов в сервисе

render(siteHeaderElement, new RankView(cards), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new QuantityFilmsView(cards), RenderPosition.AFTERBEGIN);

// Фильтры

render(siteMainElement, new FiltersView(filters), RenderPosition.AFTERBEGIN);
const navigationElement = siteMainElement.querySelector('.main-navigation');

// Сортировка и фильмы

const movieListPresenter = new MovieListPresenter(navigationElement, moviesModel);
movieListPresenter.init();
