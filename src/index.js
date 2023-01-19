import './styles/main.scss';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');

function handleSearchInput(e) {
  let countryName = e.target.value.trim();

  if (countryName !== '') {
    fetchCountries(countryName)
      .then(data => {
        if (data.length > 10) {
          countryListEl.innerHTML = '';
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          renderMarkup(data);
        }
      })
      .catch(() => {
        countryListEl.innerHTML = '';
        Notify.failure('Oops, there is no country with that name');
      });
  } else {
    return (countryListEl.innerHTML = '');
  }
}

searchInputEl.addEventListener(
  'input',
  debounce(handleSearchInput, DEBOUNCE_DELAY)
);

function renderMarkup(array) {
  if (array.length === 1) {
    createOneCountryMarkup(array);
  } else if (array.length >= 2 || array.length <= 10) {
    createMultiplyCountryMarkup(array);
  }
}

function createOneCountryMarkup(array) {
  const markup = array
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { png },
        languages,
      }) => {
        const allLanguages = Object.values(languages);

        const markup = `<li class="country-list__item">
        <div class="country-list__title">
        <img class="country-list__flag" src="${png}" width="70px" height="54px"></img>
      <p class="country-list__name">${official}</p>
      </div>
      <p class="country-list__name">Capital: <span class="name__span">${capital}</span></p>
      <p class="country-list__population">Population: <span class="population__span">${population}</span></p>
      <p class="country-list__languages">Languages: <span class="lang__span">${allLanguages}</span></p>
    </li>`;
        return markup;
      }
    )
    .join('');

  countryListEl.innerHTML = markup;
}

function createMultiplyCountryMarkup(array) {
  const markup = array
    .map(({ name: { official }, flags: { png } }) => {
      const markup = `<li class="country-list__item country-list__item--multiple">
        <img class="country-list__flag" src="${png}" width="60px" height="30px" alt="Flag of ${official}"></img>
      <p class="country-list__name">${official}</p>
    </li>`;
      return markup;
    })
    .join('');

  countryListEl.innerHTML = markup;
}
