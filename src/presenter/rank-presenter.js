import RankView from '../view/rank-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const Ranks = {
  NOVICE: 'Novice',
  FAN: 'Fun',
  MOVIE_BUFF: 'Movie Buff',
};

const QuantityLevel = {
  NOVICE: 10,
  FAN: 20,
};

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

    if (!quantityFilms) {
      return '';
    } else if (quantityFilms <= QuantityLevel.NOVICE) {
      return Ranks.NOVICE;
    } else if ( (quantityFilms > QuantityLevel.NOVICE) && (quantityFilms <= QuantityLevel.FAN) ) {
      return Ranks.FAN;
    }
    return Ranks.MOVIE_BUFF;
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
