import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

const commentsNoLoading = [{
  comment: 'Try updating the page later. Changes to comments will not be saved.',
  emotion: 'puke',
  loading: false,
  fail: true,
}];

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;
  #loading = false;

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
    if (this.#loading) {
      return;
    }
    this.#loading = true;

    try {
      const response = await this.#apiService.addComment(updatedMovie, updatedComment);
      this.#comments = response.comments;

      this.#loading = false;

      this._notify(updateType);
    } catch(err) {
      this.#loading = false;
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, updatedCommentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedCommentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(updatedCommentId);
      this.#comments.splice(index, 1);

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
