import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {DateFrom, isAfterDate} from '../utils/common.js';
import {getRank} from '../utils/rank.js';
import {MINUTES_IN_HOUR} from '../const.js';

const BAR_HEIGHT = 50;

const DateRangeName = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const createTopGenreTemplate = (countCards, topGenre) => (
  countCards ? `<li class="statistic__text-item">
  <h4 class="statistic__item-title">Top genre</h4>
  <p class="statistic__item-text">${topGenre}</p>
  </li>` : ''
);


const createStatisticsTemplate = (cardsInDateRange, topGenre, cards) => {
  const countCards = cardsInDateRange?.length;
  const totalDurationMovies = cardsInDateRange?.reduce((duration, card) => duration + card.filmInfo.runtime, 0);
  const totalHours = Math.trunc(totalDurationMovies/MINUTES_IN_HOUR);
  const totalMinutes = totalDurationMovies % MINUTES_IN_HOUR;
  const topGenreTemplate = createTopGenreTemplate(countCards, topGenre);

  const quantityFilms = cards.filter((card) => card.userDetails.alreadyWatched).length;
  const rank = getRank(quantityFilms);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${ rank }</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${countCards} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        ${ topGenreTemplate }
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class StatisticsView extends SmartView {
  #selectedDateRange = null;
  #cardsInDateRange = null;
  #uniqueGenres = null;
  #cardsInDateRangeCounts = null;
  #topGenre = null;

  constructor(cards) {
    super();

    this._data = {
      cards,
      dateFrom: DateFrom.TODAY,
      isAllTime: true,
    };

    this.#setCharts();
    this.#setDateRange();

    this.#selectedDateRange = DateRangeName.ALL_TIME;
  }

  get template() {
    this.#uniqueGenres = this.#getUniqueGenres();
    this.#cardsInDateRange = this.#getCardsInDateRange();
    this.#cardsInDateRangeCounts = this.#countCardsInDateRange();

    return createStatisticsTemplate(this.#cardsInDateRange, this.#topGenre, this._data.cards);
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setDateRange();
    this.#setDateItem();
  }

  #setDateItem = () => {
    const item = this.element.querySelector(`[value=${this.#selectedDateRange}]`);

    if (item !== null) {
      item.checked = true;
    }
  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#renderGenresChart(statisticCtx);
  }

  #setDateRange = () => {
    const statisticFilters = this.element.querySelector('.statistic__filters');
    statisticFilters.addEventListener('change', this.#dateRangeChangeHandler);
  }

  #dateRangeChangeHandler = (evt) => {
    switch (evt.target.value) {
      case DateRangeName.ALL_TIME:
        this.#selectedDateRange = DateRangeName.ALL_TIME;

        this.updateData({
          isAllTime: true,
        });

        break;
      case DateRangeName.TODAY:
        this.#selectedDateRange = DateRangeName.TODAY;

        this.updateData({
          dateFrom: DateFrom.TODAY,
          isAllTime: false,
        });

        break;
      case DateRangeName.WEEK:
        this.#selectedDateRange = DateRangeName.WEEK;

        this.updateData({
          dateFrom: DateFrom.WEEK,
          isAllTime: false,
        });

        break;
      case DateRangeName.MONTH:
        this.#selectedDateRange = DateRangeName.MONTH;

        this.updateData({
          dateFrom: DateFrom.MONTH,
          isAllTime: false,
        });

        break;
      case DateRangeName.YEAR:
        this.#selectedDateRange = DateRangeName.YEAR;

        this.updateData({
          dateFrom: DateFrom.YEAR,
          isAllTime: false,
        });

        break;
    }
  }

  #getCardsInDateRange = () => {
    const alreadyWatchedCards = this._data.cards.filter( (card) => card.userDetails.alreadyWatched );

    if (!this._data.isAllTime) {
      return alreadyWatchedCards.filter( (card) => isAfterDate(card.userDetails.watchingDate, this._data.dateFrom) );
    }

    return alreadyWatchedCards;
  }

  #countCardsInDateRange = () => {
    let max = 0;

    return this.#uniqueGenres.map((genre) => {
      const quantityCardsWithGenre = this.#cardsInDateRange
        .filter( (card) => card.filmInfo.genre?.some( (element) => element === genre ) )
        .length;

      if (quantityCardsWithGenre > max) {
        max = quantityCardsWithGenre;
        this.#topGenre = genre;
      }

      return quantityCardsWithGenre;
    });
  }

  #getUniqueGenres = () => {
    const uniqueGenres = new Set();

    this._data.cards?.forEach( (card) =>
      card.filmInfo.genre?.forEach( (genre) =>
        uniqueGenres.add(genre) ) );

    return Array.from(uniqueGenres);
  }

  #renderGenresChart = (genresCtx) => {
    if (this.#cardsInDateRange.length === 0) {
      return;
    }

    genresCtx.height = BAR_HEIGHT * this.#uniqueGenres.length;

    return new Chart(genresCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: this.#uniqueGenres,
        datasets: [{
          data: this.#cardsInDateRangeCounts,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}
