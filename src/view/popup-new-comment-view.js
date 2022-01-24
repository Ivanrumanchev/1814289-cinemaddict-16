import he from 'he';
import SmartView from './smart-view.js';

const ENTER_KEY_CODE = 'Enter';

const createNewCommentTemplate = ({isDisabled, comment, emotion}) => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${emotion ? `<img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="emoji">` : ''}
    </div>

    <label class="film-details__comment-label">
      <textarea
        class="film-details__comment-input"
        placeholder="Select reaction below and write comment here"
        name="comment"
        ${isDisabled ? ' disabled' : ''}>${ comment ? he.encode(comment) : '' }</textarea>
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
  constructor() {
    super();
    this.restoreHandlers();
    this._data = {...this._data,
      isDisabled: false,
      comment: '',
      emotion: '',
    };
  }

  get template() {
    return createNewCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);

    if (this._data.comment && this._data.emotion) {
      this.#newCommentKeysHandlerAdd();
    }
  }

  resetNewComment = () => {
    this.updateData({
      isDisabled: false,
      comment: '',
      emotion: '',
    });

    this.#newCommentKeysHandlerRemove();
  }

  resetDisabled = () => {
    this.shake( () => this.updateData({
      isDisabled: false,
    })
    );
  }

  setDisabled = () => {
    this.updateData({
      isDisabled: true,
    });

    this.#newCommentKeysHandlerRemove();

    this.element.querySelector('.film-details__emoji-list')
      .removeEventListener('click', this.#emojiClickHandler);
  }

  setAddNewCommentHandler = (callback) => {
    this._callbacks.set('AddNewCommentPressed', callback);
  }

  #newCommentKeysHandlerRemove = () => {
    document.removeEventListener('keydown', this.#keysPressedHandler);
  }

  #newCommentKeysHandlerAdd = () => {
    document.addEventListener('keydown', this.#keysPressedHandler);
  }

  #keysPressedHandler = (evt) => {
    if ( (evt.code === ENTER_KEY_CODE) && (evt.ctrlKey || evt.metaKey) ) {
      this._callbacks.get('AddNewCommentPressed')(this.#parseDataToComment(this._data));
    }
  }

  #parseDataToComment = (data) => {
    const comment = {...data};
    delete comment.isDisabled;
    return comment;
  }

  #emojiClickHandler = (evt) => {
    if (!evt.target.parentElement.classList.contains('film-details__emoji-label')) {
      return;
    }

    const newEmojiAttribute = evt.target.parentElement.getAttribute('for');
    const newEmojiName = newEmojiAttribute.slice(newEmojiAttribute.indexOf('-') + 1);

    this.updateData({
      emotion: newEmojiName,
    });

    if (this._data.comment) {
      this.#newCommentKeysHandlerAdd();
    }
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);

    if (this._data.emotion) {
      this.#newCommentKeysHandlerAdd();
    }

    if (this._data.comment.length === 0) {
      this.#newCommentKeysHandlerRemove();
    }
  }
}
