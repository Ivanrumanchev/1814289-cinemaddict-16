import FilterView from '../view/filters-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const cards = this.#moviesModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: null,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist ',
        count: filter[FilterType.WATCHLIST](cards).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History ',
        count: filter[FilterType.HISTORY](cards).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites ',
        count: filter[FilterType.FAVORITES](cards).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setStatisticsChangeHandler(this.#handleStatisticsChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleStatisticsChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.DESTROY, filterType);
  }
}
