const NAME_URL = 'https://restcountries.com/v3.1/name/';
const filter = 'name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${NAME_URL}${name}?fields=${filter}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .catch(error => {
      console.log(error.message);
    });
}
