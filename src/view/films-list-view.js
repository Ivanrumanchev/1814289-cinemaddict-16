import AbstractView from './abstract-view.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import FilmCardView from './film-card-view.js';
import ButtonShowMoreView from './button-show-more-view.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA = 2;

const createFilmsListTemplate = (title, extra) => (
  `<section class="films-list${ extra ? ' films-list--extra' : '' }">
    <h2 class="films-list__title ${ extra ? '' : 'visually-hidden' }">${ title }</h2>
    <div class="films-list__container">

    </div>

  </section>`
);

const renderCard = (filmsListElement, card) => {
  const cardComponent = new FilmCardView(card);
  cardComponent.init();
  render(filmsListElement, cardComponent, RenderPosition.BEFOREEND);
};

export default class FilmsListView extends AbstractView {
  #cards = null;
  #title = null;
  #extra = null;

  constructor (cards, title, extra) {
    super();
    this.#cards = cards;
    this.#title = title;
    this.#extra = extra;
  }

  get template() {
    return createFilmsListTemplate(this.#title, this.#extra);
  }

  init () {
    return this.#extra ? this.#initExtraList() : this.#initCommonList();
  }


  #initCommonList = function() {
    const filmsListCommonContainer = this.element.querySelector('.films-list__container');

    this.#cards
      .slice(0, Math.min(this.#cards.length, FILM_COUNT_PER_STEP))
      .forEach((card) => renderCard(filmsListCommonContainer, card));

    if (this.#cards.length > FILM_COUNT_PER_STEP) {
      const showMoreButtonComponent = new ButtonShowMoreView();
      render(this, showMoreButtonComponent, RenderPosition.BEFOREEND);

      let renderedCardCount = FILM_COUNT_PER_STEP;
      const onShowMoreButtonClick = () => {
        this.#cards
          .slice(renderedCardCount, renderedCardCount + FILM_COUNT_PER_STEP)
          .forEach((card) => renderCard(filmsListCommonContainer, card));

        renderedCardCount += FILM_COUNT_PER_STEP;

        if (renderedCardCount >= this.#cards.length) {
          remove(showMoreButtonComponent);
        }
      };

      showMoreButtonComponent.setClickHandler(onShowMoreButtonClick);
    }
  }

  #initExtraList = function() {
    const filmsListExtraContainer = this.element.querySelector('.films-list__container');

    this.#cards
      .slice(0, FILM_COUNT_EXTRA)
      .forEach((card) => renderCard(filmsListExtraContainer, card));
  }
}

