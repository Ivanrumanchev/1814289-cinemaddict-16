import {getHumanFormatDate} from '../utils/common.js';
import AbstractView from './abstract-view.js';
import he from 'he';

const createCommentTemplate = (commentary) => {
  const {author, comment, date, emotion} = commentary;
  const loading = commentary?.loading;
  const fail = commentary?.fail;
  const isInfoMessage = (loading || fail);

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      ${emotion ? `<img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="emoji-smile">` : ''}
    </span>
    <div>
      <p class="film-details__comment-text">${ comment ? he.encode(comment) : '' }</p>
      ${isInfoMessage ? '' : `<p class="film-details__comment-info">
        <span class="film-details__comment-author">${ author ? author : '' }</span>
        <span class="film-details__comment-day">${ date ? getHumanFormatDate(date) : getHumanFormatDate(new Date) }</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>`}
    </div>
  </li>`;
};

export default class PopupCommentView extends AbstractView {
  #comment = null;

  constructor (comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callbacks.set('AddNewCommentClick', callback);

    const deleteButton = this.element?.querySelector('.film-details__comment-delete');
    deleteButton?.addEventListener('click', this.#deleteButtonClickHandler);
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callbacks.get('AddNewCommentClick')(this.#comment?.id);
  }
}
