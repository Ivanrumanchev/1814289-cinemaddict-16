import {getHumanFormatDate} from '../utils/common.js';
import {getLoaderTemplate} from '../utils/loading.js';
import SmartView from './smart-view.js';
import he from 'he';

const createCommentTemplate = ({isDisabled, comment}) => {
  const mention = comment?.comment;
  const {author, date, emotion} = comment;
  const loading = comment?.loading;
  const fail = comment?.fail;
  const isInfoMessage = (loading || fail);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${emotion ? `<img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="emoji-smile">` : ''}
      </span>
      <div>
        <p class="film-details__comment-text">${ mention ? he.encode(mention) : '' }</p>
        ${isInfoMessage ? getLoaderTemplate() : `<p class="film-details__comment-info">
          <span class="film-details__comment-author">${ author ? author : '' }</span>
          <span class="film-details__comment-day">${ date ? getHumanFormatDate(date) : getHumanFormatDate(new Date) }</span>
          <button class="film-details__comment-delete">${isDisabled ? 'Deleting...' : 'Delete'}</button>
        </p>`}
      </div>
    </li>`
  );
};

export default class PopupCommentView extends SmartView {
  commentId = null;

  constructor (comment) {
    super();
    this._data = {...this._data,
      comment,
      isDisabled: false,
    };
    this.commentId = comment.id;
  }

  get template() {
    return createCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    const deleteButtonElement = this.element.querySelector('.film-details__comment-delete');
    deleteButtonElement.addEventListener('click', this.#deleteButtonClickHandler);
  }

  setDisabled = () => {
    this.updateData({
      isDisabled: true,
    });

    const deleteButtonElement = this.element.querySelector('.film-details__comment-delete');
    deleteButtonElement.removeEventListener('click', this.#deleteButtonClickHandler);
    deleteButtonElement.addEventListener('click', (evt) => evt.preventDefault());
  }

  resetDisabled = () => {
    this.shake( () => this.updateData({
      isDisabled: false,
    })
    );
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callbacks.set('deleteCommentClick', callback);

    const loading = this._data.comment?.loading;
    const fail = this._data.comment?.fail;
    const isInfoMessage = (loading || fail);

    if (!isInfoMessage) {
      const deleteButtonElement = this.element.querySelector('.film-details__comment-delete');
      deleteButtonElement.addEventListener('click', this.#deleteButtonClickHandler);
    }
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callbacks.get('deleteCommentClick')(this._data?.comment?.id);
  }
}
