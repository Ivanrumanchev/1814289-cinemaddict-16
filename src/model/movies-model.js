import AbstractObservable from './abstract-observable.js';
import {UpdateType} from '../const.js';
import {adaptToCamelCase} from '../utils/common.js';
import {showAlert} from '../utils/loading.js';

import {createLoadingContainer} from '../utils/loading.js';

export default class MoviesModel extends AbstractObservable {
  #movies = [];
  #apiService = null;
  #loading = false;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateMovie = async (updateType, update) => {
    if (this.#loading) {
      return;
    }
    this.#loading = true;

    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      showAlert('Can\'t update unexisting movie');
    }

    const loadingContainer = createLoadingContainer();
    document.body.append(loadingContainer);

    try {
      const response = await this.#apiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);

      this.#movies.splice(index, 1, updatedMovie);

      this._notify(updateType, updatedMovie);
    } catch(err) {
      showAlert('Can\'t update movie');
    }

    loadingContainer.remove();
    this.#loading = false;
  }

  #adaptToClient = (movie) => adaptToCamelCase(movie);
}
