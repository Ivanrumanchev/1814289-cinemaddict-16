import {getFullFormatDate, createElement} from '../utils.js';

const createCommentsTemplate = (comments) => comments.map(({author, comment, date, emotion}) => (
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
</li>`)).join('');

const createNewCommentTemplate = () => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`
);

const createCommentsListTemplate = ({comments}) => {
  const commentsTemplate = createCommentsTemplate(comments);
  const newCommentTemplate = createNewCommentTemplate();

  return `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list">
        ${ commentsTemplate }
      </ul>
      ${ newCommentTemplate }
    </section>
  </div>`;
};

export default class PopupCommentsView {
  #element = null;
  #cards = null;

  constructor (cards) {
    this.#cards = cards;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCommentsListTemplate(this.#cards);
  }

  removeElement() {
    this.#element = null;
  }
}
