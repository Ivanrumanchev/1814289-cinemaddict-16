import AbstractObservable from '../utils/abstract-observable.js';
import {getDeepCopy} from '../utils/common.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends AbstractObservable {
  #movies = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  #adaptToClient = (movie) => {
    const newMovie = getDeepCopy(movie);

    const adaptedMovieFilmInfoRelease = {...newMovie.film_info.release,
      date: new Date(newMovie.film_info.release.date),
      releaseCountry: newMovie.film_info.release.release_country,
    };

    const adaptedMovieFilmInfo = {...newMovie.film_info,
      ageRating: newMovie.film_info.age_rating,
      alternativeTitle: newMovie.film_info.alternative_title,
      totalRating: newMovie.film_info.total_rating,
      release: adaptedMovieFilmInfoRelease,
    };

    const adaptedMovieUserDetails = {...newMovie.user_details,
      alreadyWatched: newMovie.user_details.already_watched,
      watchingDate: newMovie.user_details.watching_date !== null
        ? new Date(newMovie.user_details.watching_date)
        : newMovie.user_details.watching_date,
    };

    const adaptedMovie = {...newMovie,
      filmInfo: adaptedMovieFilmInfo,
      userDetails: adaptedMovieUserDetails,
    };

    delete adaptedMovie.filmInfo.release.release_country;

    delete adaptedMovie.filmInfo.age_rating;
    delete adaptedMovie.filmInfo.alternative_title;
    delete adaptedMovie.filmInfo.total_rating;

    delete adaptedMovie.userDetails.already_watched;
    delete adaptedMovie.userDetails.watching_date;

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }
}
