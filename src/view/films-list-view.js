export const createFilmListTemplate = (title = '', extra = false) => (
  `<section class="films-list${ extra ? ' films-list--extra' : '' }">
    <h2 class="films-list__title ${ extra ? '' : 'visually-hidden' }">${ title }</h2>

    <div class="films-list__container">

    </div>

  </section>`
);

export const createEmptyFilmListTemplate = (template) => (
  `<section class="films-list">
    <h2 class="films-list__title">${ template }</h2>
    <!--
      Loading...
      Значение отображаемого текста зависит от выбранного фильтра:
        * All movies – 'There are no movies in our database'
        * Watchlist — 'There are no movies to watch now';
        * History — 'There are no watched movies now';
        * Favorites — 'There are no favorite movies now'.
    -->
  </section>`
);
