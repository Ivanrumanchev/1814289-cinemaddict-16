import AbstractView from './abstract-view.js';

const createRankTemplate = (rank) => (
  rank ?
    `<section class="header__profile profile">
      <p class="profile__rating">${ rank }</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>` :
    '<section class="visually-hidden"></section>'
);

export default class RankView extends AbstractView {
  #rank = null;

  constructor (rank) {
    super();
    this.#rank = rank;
  }

  get template() {
    return createRankTemplate(this.#rank);
  }
}
