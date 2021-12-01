import {createElement} from '../utils.js';

const createCommentsListTemplate = ({comments}) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list">

      </ul>

    </section>
  </div>`
);

export default class PopupCommentsListView {
  #element = null;
  #card = null;

  constructor (card) {
    this.#card = card;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCommentsListTemplate(this.#card);
  }

  removeElement() {
    this.#element = null;
  }
}
