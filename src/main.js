import RankPresenter from './presenter/rank-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesListPresenter from './presenter/movies-list-presenter.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic sadjn309jcsal';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const rankPresenter = new RankPresenter(siteHeaderElement, moviesModel);
rankPresenter.init();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

const moviesListPresenter = new MoviesListPresenter(siteMainElement, moviesModel, filterModel, commentsModel, footerStatisticsElement);
moviesListPresenter.init();

moviesModel.init();
