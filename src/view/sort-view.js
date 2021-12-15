import AbstractView from './abstract-view.js';
import {SortType} from '../const.js';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractView {
  #callback = new Map();
  #allButtons = this.element.querySelectorAll('.sort__button');

  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this.#callback.set('sortTypeChange', callback);
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#callback.get('sortTypeChange')(evt.target.dataset.sortType);
    for (const button of this.#allButtons) {
      button.classList.remove('sort__button--active');
    }
    evt.target.classList.add('sort__button--active');
  }
}
