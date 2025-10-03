const view = document.querySelector('.container');
const page = document.querySelector('.page');
const search = document.getElementById('searchInput');
const mode = document.getElementById('darkModeToggle');
const region = document.getElementById('regionSelect');
const showFavoritesBtn = document.getElementById('showFavorites');
const body = document.body;

//toggle css dark background
mode.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

// Favorites helpers
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}
function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}
function isFavorite(cca2) {
    return getFavorites().includes(cca2);
}
function toggleFavorite(cca2) {
    let favs = getFavorites();
    if (favs.includes(cca2)) {
        favs = favs.filter(code => code !== cca2);
    } else {
        favs.push(cca2);
    }
    saveFavorites(favs);
}

// list and search function
let countriesData = [];

// Show countries function
function country(countries) {
    view.innerHTML = '';
    countries.forEach(country => {
        const modalId = `modal-${country.cca2 ? country.cca2.toLowerCase() : Math.random().toString(36).substr(2, 5)}`;
        const fav = isFavorite(country.cca2);
        view.innerHTML += `<div class="card-body"> 
<strong>Country:</strong> ${country.name.official}<br>
<strong>Flag:</strong> ${country.flag} <br>
<img src="https://flagcdn.com/48x36/${country.cca2 ? country.cca2.toLowerCase() : ''}.png" alt="Flag"><br>
<strong>Region:</strong> ${country.region}<br>
<strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}<br>
<strong>Population: </strong>${country.population ? country.population.toLocaleString() : 'N/A'} <br>
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">
 View Details
</button>
<button type="button" class="btn btn-${fav ? 'danger' : 'outline-danger'} ms-2 favorite-btn" data-cca2="${country.cca2}">
 ${fav ? 'Remove Favorite' : 'Add to Favorites'}
</button>
<br><br>
<div class="modal fade" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="${modalId}Label">More Details</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
  <strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'} <br>
  <strong>Language:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'} <br>
  <strong>Currency:</strong> ${country.currencies ? Object.values(country.currencies).map(cur => cur.name).join(', ') : 'N/A'} <br>
  <strong>Timezone:</strong> ${country.timezones ? country.timezones.join(', ') : 'N/A'} <br>
  <strong>Google Map Link:</strong> <a href="https://www.google.com/maps/search/?api=1&query=${country.name.official}" target="_blank">View on Google Maps</a><br>
      </div>
    </div>
  </div>
</div>
</div>`;
    });

    // Add event listeners for favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const cca2 = this.getAttribute('data-cca2');
            toggleFavorite(cca2);
            // Re-render to update button state
            country(countries);
        });
    });
}

// show all countries
function fetchCountries(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            countriesData = data;
            country(countriesData);
        })
        .catch(error => console.error(error));
}

fetchCountries('https://restcountries.com/v3.1/all?fields=name,capital,currencies,flag,region,cca2,languages,timezones,population');

// Add search event
search.addEventListener('input', function () {
    const find = search.value.trim().toLowerCase();
    if (find === '') {
        country(countriesData);
    } else {
        const filtered = countriesData.filter(country =>
            country.name.official.toLowerCase().includes(find)
        );
        country(filtered);
    }
});

//countries by region
region.addEventListener('change', function () {
    const selectedRegion = region.value;
    if (selectedRegion === '' || selectedRegion === 'All') {
        fetchCountries('https://restcountries.com/v3.1/all?fields=name,capital,currencies,flag,region,cca2,languages,timezones,population');
    } else {
        fetchCountries(`https://restcountries.com/v3.1/region/${selectedRegion}?fields=name,capital,currencies,flag,region,cca2,languages,timezones,population`);
    }
});

// Show favorites only
showFavoritesBtn.addEventListener('click', function () {
    const favs = getFavorites();
    const favCountries = countriesData.filter(c => favs.includes(c.cca2));
    country(favCountries);
});




