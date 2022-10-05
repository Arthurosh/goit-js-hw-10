import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import getRefs from './get-refs';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputText = e.target.value.trim();

  if (inputText === '') return;

  fetchCountries(inputText)
    .then(response => {
      if (response.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (response.length >= 2 && response.length <= 10) {
        return countryListMarkup(response);
      }

      countryInfoMarkup(response);
    })
    .catch(response =>
      Notify.failure('Oops, there is no country with that name')
    );

  clearCountry();
}

function clearCountry() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function countryListMarkup(response) {
  const listMarkup = response
    .map(({ name, flags }) => {
      return `
    <li class="country-item">
    <img class="country-icon" src="${flags.svg}" alt="${name.official}" width="60"></img>
    <h2 class="country-title">${name.official}</h2>
    </li>`;
    })
    .join('');
  refs.countryList.innerHTML = listMarkup;
}

function countryInfoMarkup(response) {
  const infoMarkup = response
    .map(({ name, capital, population, flags, languages }) => {
      return `
      <h2 class="country-title"><img class="country-icon" src="${
        flags.svg
      }" alt="${name.official}" width="60"></img>${name.official}</h2>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
  refs.countryInfo.innerHTML = infoMarkup;
}
