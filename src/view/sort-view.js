import AbstractView from './abstract-view.js';
import {SortType} from '../const.js';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callbacks.set('sortTypeChange', callback);
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('sort__button')) {
      return;
    }

    evt.preventDefault();
    this._callbacks.get('sortTypeChange')(evt.target.dataset.sortType);
  }
}
