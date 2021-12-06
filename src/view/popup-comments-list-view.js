import AbstractView from './abstract-view.js';

const createCommentsListTemplate = ({comments}) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list">

      </ul>

    </section>
  </div>`
);

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
