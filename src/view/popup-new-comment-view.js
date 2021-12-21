// import AbstractView from './abstract-view.js';
import SmartView from './smart-view.js';
import {RenderPosition, render} from '../utils/render.js';
// import {runOnKeys} from '../utils/common.js';

const NewEmojiSize = {
  WIDTH: 55,
  HEIGHT: 55,
};

const NEW_COMMENT_KEY_CODE = [
  'Enter',
  'MetaLeft',
];

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

export default class PopupNewCommentView extends SmartView {
  #pressed = new Set();
  #callback = new Map();

  constructor() {
    super();
    this.restoreHandlers();
  }

  get template() {
    return createNewCommentTemplate();
  }

  restoreHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  }

  resetData = () => {
    this._data = {};
  }

  setAddNewCommentHandler = (callback) => {
    this.#callback.set('AddNewCommentClick', callback);
  }

  newCommentKeysHandlersRemove = () => {
    document.removeEventListener('keydown', this.#keysPressedHandler);
    document.removeEventListener('keyup', this.#keyUpHandler);
  }

  #newCommentKeysHandlersAdd = () => {
    document.addEventListener('keydown', this.#keysPressedHandler);
    document.addEventListener('keyup', this.#keyUpHandler);
  }

  #keysPressedHandler = (evt) => {
    this.#pressed.add(evt.code);
    for (const keyCode of NEW_COMMENT_KEY_CODE) {
      if (!this.#pressed.has(keyCode)) {
        return;
      }
    }
    this.#pressed.clear();

    this.#callback.get('AddNewCommentClick')(this._data);
  }

  #keyUpHandler = (evt) => {
    this.#pressed.delete(evt.code);
  }

  #emojiClickHandler = (evt) => {
    if (!evt.target.parentElement.classList.contains('film-details__emoji-label')) {
      return;
    }

    const newEmoji = evt.target.cloneNode(true);
    const newEmojiAttribute = evt.target.parentElement.getAttribute('for');
    const newEmojiName = newEmojiAttribute.slice(newEmojiAttribute.indexOf('-') + 1);

    newEmoji.setAttribute('width', NewEmojiSize.WIDTH);
    newEmoji.setAttribute('height', NewEmojiSize.HEIGHT);
    newEmoji.setAttribute('alt', newEmojiAttribute);

    const addEmojiLabel = this.element.querySelector('.film-details__add-emoji-label');
    addEmojiLabel.innerHTML = '';
    render(addEmojiLabel, newEmoji, RenderPosition.BEFOREEND);

    this.updateData({
      emotion: newEmojiName,
    }, true);

    if (this._data.comment) {
      this.#newCommentKeysHandlersAdd();
    }
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);

    if (this._data.emotion) {
      this.#newCommentKeysHandlersAdd();
    }

    if (this._data.comment.length === 0) {
      this.newCommentKeysHandlersRemove();
    }
  }
}
