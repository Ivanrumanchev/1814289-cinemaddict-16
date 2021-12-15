import AbstractView from './abstract-view.js';

const createButtonShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonShowMoreView extends AbstractView {
  #callback = new Map();

  get template() {
    return createButtonShowMoreTemplate();
  }

  setClickHandler = (callback) => {
    this.#callback.set('click', callback);
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = () => {
    this.#callback.get('click')();
  }
}
