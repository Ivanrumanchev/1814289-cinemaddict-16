import AbstractView from './abstract-view.js';
import {getLoaderTemplate} from '../utils/loading.js';

const createNoMoviesTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
    ${getLoaderTemplate()}
  </section>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoMoviesTemplate();
  }
}
