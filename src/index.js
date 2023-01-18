import './styles/main.scss';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const NAME_URL = 'https://restcountries.com/v3.1/name/';

const searchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const filter = 'name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${NAME_URL}${name}?fields=${filter}`)
    .then(response => {
      if (!response.ok) {
        console.log('response -->', response);
        throw new Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then(data => {
      console.log('data -->', data);
      renderMarkup(data);
    });
}

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
        <img class="country-list__flag" src="${png}" width="60"></img>
      <p class="country-list__name">${official}</p>
      <p class="country-list__name">Capital: ${capital}</p>
      <p class="country-list__population">Population: ${population}</p>
      <p class="country-list__languages">Languages: ${allLanguages}</p>
    </li>`;
        return markup;
      }
    )
    .join('');
  countryListEl.insertAdjacentHTML('beforeend', markup);
}

function createMultiplyCountryMarkup(array) {
  const markup = array
    .map(({ name: { official }, flags: { png } }) => {
      const markup = `<li class="country-list__item">
        <img class="country-list__flag" src="${png}" width="60"></img>
      <p class="country-list__name">${official}</p>
    </li>`;
      return markup;
    })
    .join('');
  countryListEl.insertAdjacentHTML('beforeend', markup);
}

function handleSearchInput(e) {
  console.log('e.target.value -->', e.target.value);
  if (e.target.value !== '') {
    fetchCountries(e.target.value);
  }
}

searchInputEl.addEventListener(
  'input',
  debounce(handleSearchInput, DEBOUNCE_DELAY)
);

function handleKeyPressInput(e) {
  e.preventDefault();
  console.log(' -->', e);

  if (e.code === 'BackSpace') {
    searchInputEl.removeEventListener(
      'input',
      debounce(handleSearchInput, DEBOUNCE_DELAY)
    );
  }
}

searchInputEl.addEventListener('keypress', debounce(handleKeyPressInput));
