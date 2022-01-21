import AbstractView from './abstract-view.js';

const TextComments = {
  LOADING: 'are loading',
  FAIL: 'did not load.',
};

const getTextComments = (loading, fail, comments) => {
  if (loading) {
    return TextComments.LOADING;
  }
  return fail ? TextComments.FAIL : comments.length;
};

const createCommentsListTemplate = (comments) => {
  const loading = comments[0]?.loading;
  const fail = comments[0]?.fail;

  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${ getTextComments(loading, fail, comments) }</span></h3>
        <ul class="film-details__comments-list">

        </ul>

      </section>
    </div>`
  );
};

export default class PopupCommentsListView extends AbstractView {
  _data = {};

  constructor (comments) {
    super();
    this._data = {...this._data, ...comments};
  }

  get template() {
    return createCommentsListTemplate(Object.values(this._data));
  }

  updateComments = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);
  }

  resetComments = () => {
    this._data = {};
  }
}
