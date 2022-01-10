import AbstractView from './abstract-view.js';

const createButtonShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonShowMoreView extends AbstractView {
  get template() {
    return createButtonShowMoreTemplate();
  }

  setClickHandler = (callback) => {
    this._callbacks.set('click', callback);
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = () => {
    this._callbacks.get('click')();
  }
}
