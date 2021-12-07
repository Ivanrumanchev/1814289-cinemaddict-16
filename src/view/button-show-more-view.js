import AbstractView from './abstract-view.js';

const createButtonShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonShowMoreView extends AbstractView {
  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = () => {
    this._callback.click();
  }

  get template() {
    return createButtonShowMoreTemplate();
  }
}
