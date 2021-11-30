import {createElement} from '../utils.js';

const createPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">

    </form>
  </section>`
);

export default class PopupView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
