import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

const commentsNoLoading = [{
  comment: 'Try updating the page later. Changes to comments will not be saved.',
  emotion: 'puke',
  loading: false,
  fail: true,
}];

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
      const comments = await this.#apiService.getComments(movie.id);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = commentsNoLoading;
    }
    this._notify(UpdateType.INIT);
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment,
      date: new Date(comment.date) !== null
        ? new Date(comment.date)
        : comment.date,
    };

    return adaptedComment;
  }
}
