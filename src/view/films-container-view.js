import {createElement} from '../utils.js';

const createFilmsContainerTemplate = () => (
  `<section class="films">

  </section>`
);

export default class FilmsContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsContainerTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

