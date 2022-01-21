import SmartView from './smart-view.js';

const createControlButtonsTemplate = ({watchlist, alreadyWatched, favorite}) => (
  `<section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist${ watchlist ? ' film-details__control-button--active' : '' }" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button film-details__control-button--watched${ alreadyWatched ? ' film-details__control-button--active' : '' }" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite${ favorite ? ' film-details__control-button--active' : '' }" id="favorite" name="favorite">Add to favorites</button>
  </section>`
);

export default class PopupControlButtonsView extends SmartView {
  constructor (card) {
    super();
    this._data = {...this._data, ...card};
  }

  get template() {
    return createControlButtonsTemplate(this._data?.userDetails);
  }

  resetControlButtons = () => {
    this._data = {};
  }

  restoreHandlers = () => {
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchListClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#markAsWatchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setAddToWatchListClickHandler = (callback) => {
    this._callbacks.set('addToWatchListClick', callback);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchListClickHandler);
  }

  setMarkAsWatchedClickHandler = (callback) => {
    this._callbacks.set('markAsWatchedClick', callback);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#markAsWatchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callbacks.set('favoriteClick', callback);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #addToWatchListClickHandler = () => {
    this._callbacks.get('addToWatchListClick')();
  }

  #markAsWatchedClickHandler = () => {
    this._callbacks.get('markAsWatchedClick')();
  }

  #favoriteClickHandler = () => {
    this._callbacks.get('favoriteClick')();
  }
}
