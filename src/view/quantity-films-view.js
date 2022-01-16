import AbstractView from './abstract-view.js';

const createQuantityFilmsTemplate = (quantityMovies) => (
  `<p>${ quantityMovies } movies inside</p>`
);

export default class QuantityFilmsView extends AbstractView  {
  #quantityMovies = null;

  constructor (quantityMovies) {
    super();
    this.#quantityMovies = quantityMovies;
  }

  get template() {
    return createQuantityFilmsTemplate(this.#quantityMovies);
  }
}
