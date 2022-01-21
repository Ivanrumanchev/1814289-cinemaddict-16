import {getTimeFromMins, getDayFormatDate} from '../utils/common.js';
import AbstractView from './abstract-view.js';

const createGenresTemplate = (genres) => (
  genres
    .map((genre) => `<span class="film-details__genre">${ genre }</span>`)
    .join('')
);

const createFilmDetailsTemplate = ({filmInfo}) => {
  const {title, alternativeTitle, totalRating, poster, release, runtime, genre, description, ageRating, director, writers, actors} = filmInfo;

  const genresTemplate = createGenresTemplate(genre);

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${ poster } alt="">

          <p class="film-details__age">${ ageRating }+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${ title }</h3>
              <p class="film-details__title-original">Original: ${ alternativeTitle }</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${ totalRating }</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${ director }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${ writers.join(', ') }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${ actors.join(', ') }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${ getDayFormatDate(release.date) }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${ getTimeFromMins(runtime) }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${ release.releaseCountry }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${ genre.length === 1 ? 'Genre' : 'Genres' }</td>
              <td class="film-details__cell">
                ${ genresTemplate }
            </tr>
          </table>

          <p class="film-details__film-description">
            ${ description }
          </p>
        </div>
      </div>


    </div>`
  );
};

export default class PopupFilmDetailsView extends AbstractView {
  #card = null;

  constructor (card) {
    super();
    this.#card = card;
  }

  get template() {
    return createFilmDetailsTemplate(this.#card);
  }

  setClosePopupClickHandler = (callback) => {
    this._callbacks.set('closePopupClick', callback);
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  #closePopupClickHandler = () => {
    this._callbacks.get('closePopupClick')();
  }
}
