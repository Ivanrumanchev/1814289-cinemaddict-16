import {createElement} from '../utils.js';

const createFilmsListTemplate = (title = '', extra = false) => (
  `<section class="films-list${ extra ? ' films-list--extra' : '' }">
    <h2 class="films-list__title ${ extra ? '' : 'visually-hidden' }">${ title }</h2>
    <div class="films-list__container">

    </div>

  </section>`
);

// const createEmptyFilmListTemplate = (template) => (
//   `<section class="films-list">
//     <h2 class="films-list__title">${ template }</h2>
//     <!--
//       Loading...
//       Значение отображаемого текста зависит от выбранного фильтра:
//         * All movies – 'There are no movies in our database'
//         * Watchlist — 'There are no movies to watch now';
//         * History — 'There are no watched movies now';
//         * Favorites — 'There are no favorite movies now'.
//     -->
//   </section>`
// );

export default class FilmsListView {
  #element = null;
  #title = null;
  #extra = null;

  constructor (title, extra) {
    this.#title = title;
    this.#extra = extra;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListTemplate(this.#title, this.#extra);
  }

  removeElement() {
    this.#element = null;
  }
}

