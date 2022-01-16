import AbstractObservable from '../utils/abstract-observable.js';
import {getDeepCopy} from '../utils/common.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (movie) => {
    try {
      const comments = await this.#apiService.getComments(movie?.id);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);
  }

  clear = () => {
    this.#comments = [];
  }

  // updateMovie = (updateType, update) => {
  //   const index = this.#movies.findIndex((movie) => movie.id === update.id);

  //   if (index === -1) {
  //     throw new Error('Can\'t update unexisting movie');
  //   }

  //   this.#movies = [
  //     ...this.#movies.slice(0, index),
  //     update,
  //     ...this.#movies.slice(index + 1),
  //   ];

  //   this._notify(updateType, update);
  // }

  #adaptToClient = (comment) => {
    const newComment = getDeepCopy(comment);

    const adaptedComment = {...newComment,
      date: new Date(newComment.date) !== null
        ? new Date(newComment.date)
        : newComment.date,
    };

    return adaptedComment;
  }
}
