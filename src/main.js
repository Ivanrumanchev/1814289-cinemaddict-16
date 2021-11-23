import {renderTemplate, RenderPosition} from './render.js';
import {createProfileTemplate} from './view/profile-view.js';
import {createFilterAndSortTemplate} from './view/filter-and-sort-view.js';
import {createFilmListTemplate} from './view/film-list-view.js';
import {createButtonShowMoreTemplate} from './view/button-show-more-view.js';
import {createPopupTemplate} from './view/popup-view.js';


const FILM_COUNT = 5;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilterAndSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createFilmListTemplate(FILM_COUNT, false, '', createButtonShowMoreTemplate), RenderPosition.BEFOREEND);
renderTemplate(siteFooterElement, createPopupTemplate(), RenderPosition.AFTEREND);
