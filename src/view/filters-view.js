import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a
      href="#${ type }"
      class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
      ${name}
      ${count ? `<span class="main-navigation__item-count">${ count } </span>` : ''}
    </a>`
  );
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">

      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional${currentFilterType === 'stats' ? ' main-navigation__additional--active' : '' }">Stats</a>
  </nav>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor (filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    const navigationElement = this.element.querySelector('.main-navigation__items');
    this._callbacks.set('filterTypeChange', callback);
    navigationElement.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const navigationItemElement = evt.target.closest('a.main-navigation__item');

    if (!navigationItemElement) {
      return;
    }

    const href = navigationItemElement.getAttribute('href')?.slice?.(1);

    if (href?.length) {
      this._callbacks.get('filterTypeChange')(href);
    }
  }

  setStatisticsChangeHandler = (callback) => {
    const statisticsElement = this.element.querySelector('.main-navigation__additional');
    this._callbacks.set('statisticsChange', callback);
    statisticsElement.addEventListener('click', this.#statisticsChangeHandler);
  }

  #statisticsChangeHandler = (evt) => {
    evt.preventDefault();

    const href = evt.target.getAttribute('href')?.slice?.(1);

    if (href?.length) {
      this._callbacks.get('statisticsChange')(href);
    }
  }
}
