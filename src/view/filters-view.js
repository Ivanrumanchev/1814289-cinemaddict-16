import {capitalizeFirstLetter, createElement} from '../utils.js';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  return `<a href="#${ name }" class="main-navigation__item">${ capitalizeFirstLetter(name) } <span class="main-navigation__item-count">${ count }</span></a>`;
};

const createFiltersTemplate = (filters) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${ filters.map((filter) => createFilterItemTemplate(filter)).join('') }
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class FiltersView {
  #element = null;
  #filters = null;

  constructor (filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
