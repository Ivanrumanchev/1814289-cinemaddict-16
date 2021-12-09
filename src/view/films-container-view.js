import AbstractView from './abstract-view.js';
import {RenderPosition, render} from '../utils/render.js';
import FilmsListEmptyView from './films-list-empty-view.js';
import FilmsListView from './films-list-view.js';

const FilmsListTitles = {
  COMMON: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const createFilmsContainerTemplate = () => (
  `<section class="films">

  </section>`
);

export default class FilmsContainerView extends AbstractView {
  #cards = null;

  constructor (cards) {
    super();
    this.#cards = cards;
  }

  get template() {
    return createFilmsContainerTemplate();
  }

  init () {
    if (this.#cards.length === 0) {
      render(this.element, new FilmsListEmptyView(), RenderPosition.BEFOREEND);
      return;
    }

    // Список фильмов Common + ShowMoreButton

    const filmsListCommon = new FilmsListView(this.#cards, FilmsListTitles.COMMON, false);
    filmsListCommon.init();
    render(this.element, filmsListCommon, RenderPosition.BEFOREEND);

    // Список фильмов Top Rated

    const filmsListTopRated = new FilmsListView(this.#cards, FilmsListTitles.TOP_RATED, true);
    filmsListTopRated.init();
    render(this.element, filmsListTopRated, RenderPosition.BEFOREEND);

    // Список фильмов Most Commented

    const filmsListMostCommented = new FilmsListView(this.#cards, FilmsListTitles.MOST_COMMENTED, true);
    filmsListMostCommented.init();
    render(this.element, filmsListMostCommented, RenderPosition.BEFOREEND);
  }
}
