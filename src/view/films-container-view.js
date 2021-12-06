import AbstractView from './abstract-view.js';

const createFilmsContainerTemplate = () => (
  `<section class="films">

  </section>`
);

export default class FilmsContainerView extends AbstractView {
  get template() {
    return createFilmsContainerTemplate();
  }
}
