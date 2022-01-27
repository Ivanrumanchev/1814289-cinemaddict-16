import FilterView from '../view/filters-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {getQuantityFilteredMovies} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

const ALL_MOVIES_FILTER_NAME = 'All movies';

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

    const quantityFilteredMovies = getQuantityFilteredMovies(cards);

    return [
      {
        type: FilterType.ALL,
        name: ALL_MOVIES_FILTER_NAME,
        count: null,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterType.WATCHLIST[0].toUpperCase() + FilterType.WATCHLIST.slice(1),
        count: quantityFilteredMovies[FilterType.WATCHLIST],
      },
      {
        type: FilterType.HISTORY,
        name: FilterType.HISTORY[0].toUpperCase() + FilterType.HISTORY.slice(1),
        count: quantityFilteredMovies[FilterType.HISTORY],
      },
      {
        type: FilterType.FAVORITES,
        name: FilterType.FAVORITES[0].toUpperCase() + FilterType.FAVORITES.slice(1),
        count: quantityFilteredMovies[FilterType.FAVORITES],
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
