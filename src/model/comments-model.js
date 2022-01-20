import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';
import {showAlert} from '../utils/loading.js';

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
      this.#comments = await this.#apiService.getComments(movie.id);
    } catch(err) {
      this.#comments = commentsNoLoading;
    }
    this._notify(UpdateType.INIT);
  }

  addComment = async (updateType, updatedComment, updatedMovie) => {
    try {
      const response = await this.#apiService.addComment(updatedMovie, updatedComment);
      this.#comments = response.comments;

      this._notify(updateType);
    } catch(err) {
      showAlert('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, updatedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedComment.id);

    if (index === -1) {
      showAlert('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(updatedComment);
      this.#comments.splice(index, 1);

      this._notify(updateType);
    } catch(err) {
      showAlert('Can\'t delete comment');
    }
  }
}
