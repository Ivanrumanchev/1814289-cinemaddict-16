import AbstractView from './abstract-view.js';

const createFilmsListTemplate = (title, extra) => (
  `<section class="films-list${ extra ? ' films-list--extra' : '' }">
    <h2 class="films-list__title ${ extra ? '' : 'visually-hidden' }">${ title }</h2>
    <div class="films-list__container">

    </div>

  </section>`
);

export default class FilmsListView extends AbstractView {
  #title = null;
  #extra = null;

  constructor (title, extra) {
    super();
    this.#title = title;
    this.#extra = extra;
  }

  get template() {
    return createFilmsListTemplate(this.#title, this.#extra);
  }
}

