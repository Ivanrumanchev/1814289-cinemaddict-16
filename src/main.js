import {RenderPosition, render} from './utils/render.js';

import RankView from './view/rank-view.js';
import QuantityFilmsView from './view/quantity-films-view.js';

import FilterPresenter from './presenter/filter-presenter.js';

import MovieListPresenter from './presenter/movie-list-presenter.js';

import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';

import {generateMovie} from './mock/movie.js';

const FILM_COUNT = 23;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const cards = Array.from( {length: FILM_COUNT}, generateMovie );

const moviesModel = new MoviesModel();
moviesModel.movies = cards;

const filterModel = new FilterModel();

// Звание и кол-во фильмов в сервисе

render(siteHeaderElement, new RankView(cards), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new QuantityFilmsView(cards), RenderPosition.AFTERBEGIN);

// Фильтры

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

// Сортировка и фильмы

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
movieListPresenter.init();
