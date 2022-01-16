import {getDeepCopy} from './utils/common.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (movieId) => this.#load({url: `comments/${movieId}`})
    .then(ApiService.parseResponse)

  updateCard = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (movie) => {
    const newMovie = getDeepCopy(movie);

    const adaptedMovieFilmInfoRelease = {...newMovie.filmInfo.release,
      date: newMovie.filmInfo.release.date instanceof Date
        ? newMovie.filmInfo.release.date.toISOString()
        : newMovie.filmInfo.release.date,
      'release_country': newMovie.filmInfo.release.releaseCountry,
    };

    const adaptedMovieFilmInfo = {...newMovie.filmInfo,
      'age_rating': newMovie.filmInfo.ageRating,
      'alternative_title': newMovie.filmInfo.alternativeTitle,
      'total_rating': newMovie.filmInfo.totalRating,
      release: adaptedMovieFilmInfoRelease,
    };

    const adaptedMovieUserDetails = {...newMovie.userDetails,
      'already_watched': newMovie.userDetails.alreadyWatched,
      'watching_date': newMovie.userDetails.watchingDate instanceof Date
        ? newMovie.userDetails.watchingDate.toISOString()
        : newMovie.userDetails.watchingDate,
    };

    const adaptedMovie = {...newMovie,
      'film_info': adaptedMovieFilmInfo,
      'user_details': adaptedMovieUserDetails,
    };

    delete adaptedMovie.filmInfo.release.releaseCountry;

    delete adaptedMovie.filmInfo.ageRating;
    delete adaptedMovie.filmInfo.alternativeTitle;
    delete adaptedMovie.filmInfo.totalRating;

    delete adaptedMovie.userDetails.alreadyWatched;
    delete adaptedMovie.userDetails.watchingDate;

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;

    return adaptedMovie;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
