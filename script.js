const moviesDiv = document.getElementById("movies");
const detailsDiv = document.getElementById("details");
const themeBtn = document.getElementById("themeToggle");

// LOAD GENRES
async function loadGenres() {
  const res = await fetch(`${BASE}/genre/movie/list?api_key=${API_KEY}`);
  const data = await res.json();

  const select = document.getElementById("genre");

  data.genres.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.name;
    select.appendChild(opt);
  });
}

// LOAD MOVIES
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.results);
}

// DISPLAY MOVIES
function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const div = document.createElement("div");
    div.classList.add("movie");

    div.innerHTML = `
      <img src="${IMG + movie.poster_path}">
      <div class="info">
        <span>${movie.title}</span>
        <span>⭐ ${movie.vote_average}</span>
      </div>
    `;

    div.onclick = () => showDetails(movie.id);

    moviesDiv.appendChild(div);
  });
}

// SEARCH
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value;

  if (q === "") {
    getMovies(`${BASE}/discover/movie?api_key=${API_KEY}`);
    return;
  }

  getMovies(`${BASE}/search/movie?api_key=${API_KEY}&query=${q}`);
});

// GENRE FILTER
document.getElementById("genre").addEventListener("change", (e) => {
  const id = e.target.value;
  getMovies(`${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${id}`);
});

// SORT
document.getElementById("sort").addEventListener("change", (e) => {
  const sort = e.target.value;
  getMovies(`${BASE}/discover/movie?api_key=${API_KEY}&sort_by=${sort}`);
});

// // DETAILS + WATCH OPTIONS

async function showDetails(id) {
  const res = await fetch(`${BASE}/movie/${id}?api_key=${API_KEY}`);
  const movie = await res.json();

  const watchRes = await fetch(`${BASE}/movie/${id}/watch/providers?api_key=${API_KEY}`);
  const watch = await watchRes.json();

  const providers = watch.results.IN?.flatrate || [];

  detailsDiv.innerHTML = `
    <img src="${IMG + movie.poster_path}">
    <div>
      <h2>${movie.title}</h2>
      <p>${movie.overview}</p>

      <h3>Watch Options</h3>
      <div class="watch">
        ${providers.length
          ? providers.map(p => `<span>${p.provider_name}</span>`).join("")
          : "Not available in your region"}
      </div>

      <button onclick='addFav(${JSON.stringify(movie)})'>
        Add to Favorites
      </button>
    </div>
  `;
}

// FAVORITES
function addFav(movie) {
  let fav = JSON.parse(localStorage.getItem("fav")) || [];
  fav.push(movie);
  localStorage.setItem("fav", JSON.stringify(fav));
  alert("Added to favorites");
}

// DARK MODE + TEXT CHANGE
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "Light Mode";
  } else {
    themeBtn.textContent = "Dark Mode";
  }
};

// INIT
loadGenres();
getMovies(`${BASE}/discover/movie?api_key=${API_KEY}`);