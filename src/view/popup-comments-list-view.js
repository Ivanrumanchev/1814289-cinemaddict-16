import AbstractView from './abstract-view.js';

const TextComments = {
  LOADING: 'are loading',
  FAIL: 'did not load.',
};

const getTextComments = (loading, fail, comments) => {
  if (loading) {
    return TextComments.LOADING;
  } else if (fail) {
    return TextComments.FAIL;
  }
  return comments.length;
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
  #card = null;

  constructor (card) {
    super();
    this.#card = card;
  }

  get template() {
    return createCommentsListTemplate(this.#card);
  }
}
