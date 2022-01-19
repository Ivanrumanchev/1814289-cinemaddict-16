import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyFilmsListTemplate = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];
  return (
    `<section class="films-list">
      <h2 class="films-list__title">${ noFilmsTextValue }</h2>
    </section>`
  );
};

export default class FilmsListEmptyView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createEmptyFilmsListTemplate(this.#data);
  }
}
