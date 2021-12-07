import AbstractView from './abstract-view.js';

const createQuantityFilmsTemplate = (cards) => (
  `<p>${ cards.length } movies inside</p>`
);

export default class QuantityFilmsView extends AbstractView  {
  #cards = null;

  constructor (cards) {
    super();
    this.#cards = cards;
  }

  get template() {
    return createQuantityFilmsTemplate(this.#cards);
  }
}
