import {RenderPosition, render} from './render.js';

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

  const filmDetails = popupComponent.element.querySelector('.film-details__inner');
  const commentsList = popupCommentsListComponent.element.querySelector('.film-details__comments-list');

  const onCloseButtonClick = () => {
    document.body.classList.remove('hide-overflow');
    popupComponent.element.remove();
    // popupFilmDetailsComponent.element.remove();
    // popupCommentsListComponent.element.remove();
    // popupCommentComponents.forEach((component) => component.element.remove());
    // popupNewCommentComponent.element.remove();
  };

  const onFilmCardClick = () => {
    render(siteFooterElement, popupComponent.element, RenderPosition.AFTEREND);
    render(filmDetails, popupFilmDetailsComponent.element, RenderPosition.AFTERBEGIN);
    render(filmDetails, popupCommentsListComponent.element, RenderPosition.BEFOREEND);
    popupCommentComponents.forEach((component) => render(commentsList, component.element, RenderPosition.BEFOREEND));
    render(commentsList, popupNewCommentComponent.element, RenderPosition.AFTEREND);

    document.body.classList.add('hide-overflow');

    filmDetails.querySelector('.film-details__close-btn').addEventListener('click', onCloseButtonClick);
  };

  cardComponent.element.querySelector('.film-card__link').addEventListener('click', onFilmCardClick);

  render(filmsListElement, cardComponent.element, RenderPosition.BEFOREEND);
};

const cards = Array.from( {length: FILM_COUNT}, generateMovie );
const filters = generateFilter(cards);

// Звание и кол-во фильмов в сервисе

render(siteHeaderElement, new RankView(cards).element, RenderPosition.BEFOREEND);
render(footerStatisticsElement, new QuantityFilmsView(cards).element, RenderPosition.AFTERBEGIN);

// Сортировка и фильтры

render(siteMainElement, new SortView().element, RenderPosition.AFTERBEGIN);
render(siteMainElement, new FiltersView(filters).element, RenderPosition.AFTERBEGIN);

// Список фильмов Common и кнопка ShowMore

const filmsContainer = new FilmsContainerView();
render(siteMainElement, filmsContainer.element, RenderPosition.BEFOREEND);
const filmsListCommon = new FilmsListView(FilmsListTitles.COMMON);
render(filmsContainer.element, filmsListCommon.element, RenderPosition.BEFOREEND);

const filmsListCommonContainer = filmsListCommon.element.querySelector('.films-list__container');

cards
  .slice(0, Math.min(cards.length, FILM_COUNT_PER_STEP))
  .forEach((card) => renderCard(filmsListCommonContainer, card));

if (cards.length > FILM_COUNT_PER_STEP) {
  const showMoreButton = new ButtonShowMoreView();
  render(filmsListCommon.element, showMoreButton.element, RenderPosition.BEFOREEND);

  let renderedCardCount = FILM_COUNT_PER_STEP;
  const onShowMoreButtonClick = () => {
    cards
      .slice(renderedCardCount, renderedCardCount + FILM_COUNT_PER_STEP)
      .forEach((card) => renderCard(filmsListCommonContainer, card));

    renderedCardCount += FILM_COUNT_PER_STEP;

    if (renderedCardCount >= cards.length) {
      showMoreButton.element.remove();
    }
  };

  showMoreButton.element.addEventListener('click', onShowMoreButtonClick);
}

// Список фильмов Top Rated

const filmsListTopRated = new FilmsListView(FilmsListTitles.TOP_RATED, true);
render(filmsContainer.element, filmsListTopRated.element, RenderPosition.BEFOREEND);

const filmsListTopRatedContainer = filmsListTopRated.element.querySelector('.films-list__container');

cards
  .slice(0, FILM_COUNT_EXTRA)
  .forEach((card) => renderCard(filmsListTopRatedContainer, card));

// Список фильмов Most Commented

const filmsListMostCommented = new FilmsListView(FilmsListTitles.MOST_COMMENTED, true);
render(filmsContainer.element, filmsListMostCommented.element, RenderPosition.BEFOREEND);

const filmsListMostCommentedContainer = filmsListMostCommented.element.querySelector('.films-list__container');

cards
  .slice(0, FILM_COUNT_EXTRA)
  .forEach((card) => renderCard(filmsListMostCommentedContainer, card));
