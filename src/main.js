import {RenderPosition, render} from './utils/render.js';

import QuantityFilmsView from './view/quantity-films-view.js';

import RankPresenter from './presenter/rank-presenter.js';
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

render(footerStatisticsElement, new QuantityFilmsView(cards), RenderPosition.AFTERBEGIN);

const rankPresenter = new RankPresenter(siteHeaderElement, moviesModel);
rankPresenter.init();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
movieListPresenter.init();
