import AbstractObservable from '../utils/abstract-observable.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterModel extends AbstractObservable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
    this._notify(UpdateType.MAJOR, filter);
  }
}
