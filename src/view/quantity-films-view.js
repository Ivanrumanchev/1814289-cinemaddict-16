import {createElement} from '../utils.js';

const createQuantityFilmsTemplate = (cards) => (
  `<p>${ cards.length } movies inside</p>`
);

export default class QuantityFilmsView {
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
    return createQuantityFilmsTemplate(this.#cards);
  }

  removeElement() {
    this.#element = null;
  }
}
