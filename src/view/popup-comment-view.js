import {getFullFormatDate} from '../utils/common.js';
import AbstractView from './abstract-view.js';

const createCommentTemplate = ({author, comment, date, emotion}) => (
  `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${ comment }</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${ author }</span>
      <span class="film-details__comment-day">${ getFullFormatDate(date) }</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`);

export default class PopupCommentView extends AbstractView {
  #comment = null;

  constructor (comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }
}
