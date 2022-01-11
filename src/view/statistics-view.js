import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {DateFrom, isAfterDate} from '../utils/common.js';

const BAR_HEIGHT = 50;

const DateRangeName = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const countCardsInDateRange = (uniqueGenres, cards, dateFrom, isAllTime) => {
  let cardsInDate = cards;

  if (!isAllTime) {
    cardsInDate = cards.filter( (card) => isAfterDate(card.userDetails.watchingDate, dateFrom) );
  }

  return uniqueGenres.map((genre) =>
    cardsInDate
      .filter( (card) => card.filmInfo.genre?.some( (element) => element === genre ) )
      .length
  );
};

const renderGenresChart = (genresCtx, cards, dateFrom, isAllTime) => {
  let uniqueGenres = new Set();

  cards?.forEach( (card) =>
    card.filmInfo.genre?.forEach( (genre) =>
      uniqueGenres.add(genre) ) );

  genresCtx.height = BAR_HEIGHT * uniqueGenres.size;

  uniqueGenres = Array.from(uniqueGenres);

  const cardsInDateRangeCounts = countCardsInDateRange(uniqueGenres, cards, dateFrom, isAllTime);

  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqueGenres,
      datasets: [{
        data: cardsInDateRangeCounts,
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
};

const createStatisticsTemplate = () => (
  `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
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
        <p class="statistic__item-text">28 <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">69 <span class="statistic__item-description">h</span> 41 <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Drama</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
);

export default class StatisticsView extends SmartView {
  #dateItem = null;

  constructor(cards) {
    super();

    this._data = {
      cards,
      dateFrom: DateFrom.TODAY,
      isAllTime: true,
    };

    this.#setCharts();
    this.#setDateRange();

    this.#dateItem = DateRangeName.ALL_TIME;
  }

  get template() {
    return createStatisticsTemplate();
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setDateRange();
    this.#setDateItem();
  }

  #setDateItem = () => {
    const item = this.element.querySelector(`[value=${this.#dateItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }

  #setCharts = () => {
    const {cards, dateFrom, isAllTime} = this._data;
    const statisticCtx = this.element.querySelector('.statistic__chart');

    renderGenresChart(statisticCtx, cards, dateFrom, isAllTime);
  }

  #setDateRange = () => {
    const statisticFilters = this.element.querySelector('.statistic__filters');
    statisticFilters.addEventListener('change', (evt) => {
      switch (evt.target.value) {
        case DateRangeName.ALL_TIME:
          this.#dateItem = DateRangeName.ALL_TIME;
          this.updateData({
            isAllTime: true,
          });
          break;
        case DateRangeName.TODAY:
          this.#dateItem = DateRangeName.TODAY;
          this.updateData({
            dateFrom: DateFrom.TODAY,
            isAllTime: false,
          });
          break;
        case DateRangeName.WEEK:
          this.#dateItem = DateRangeName.WEEK;
          this.updateData({
            dateFrom: DateFrom.WEEK,
            isAllTime: false,
          });
          break;
        case DateRangeName.MONTH:
          this.#dateItem = DateRangeName.MONTH;
          this.updateData({
            dateFrom: DateFrom.MONTH,
            isAllTime: false,
          });
          break;
        case DateRangeName.YEAR:
          this.#dateItem = DateRangeName.YEAR;
          this.updateData({
            dateFrom: DateFrom.YEAR,
            isAllTime: false,
          });
          break;
      }
    });
  }
}
