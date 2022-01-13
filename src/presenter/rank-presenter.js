import RankView from '../view/rank-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {getRank} from '../utils/rank.js';

export default class RankPresenter {
  #rankContainer = null;
  #moviesModel = null;
  #rankComponent = null;

  constructor(rankContainer, moviesModel) {
    this.#rankContainer = rankContainer;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get rank() {
    const cards = this.#moviesModel.movies;
    const quantityFilms = cards.filter((card) => card.userDetails.alreadyWatched).length;

    return getRank(quantityFilms);
  }

  init = () => {
    const rank = this.rank;
    const prevRankComponent = this.#rankComponent;

    this.#rankComponent = new RankView(rank);

    if (prevRankComponent === null) {
      render(this.#rankContainer, this.#rankComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#rankComponent, prevRankComponent);
    remove(prevRankComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
