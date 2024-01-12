const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODA4NmM3MDU2ZGQ3N2JjNzg1NDI3Mjg2MDgzYTQyZCIsInN1YiI6IjY1OTY0Y2Q1ODY5ZTc1NmZhYTA2OGIzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8FF4v9J3HjX0AGZo8cM9VfSfaGYfnYqLHUHW8KrBWCw",
  },
};
const base_url = "https://image.tmdb.org/t/p/w500";
const movieId = location.href.split("?")[1];

fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    detailMovie(data);
  });

function detailMovie(data) {
  const movieInfo = document.createElement("div");

  const movieGenres = data.genres.map(genre => genre.name);
  const genreString = movieGenres.join(', ');

  movieInfo.innerHTML = `
  <div>
    <p class="movie_id">ID: ${data.id}</p>
    <h1 class="movie_title">${data.title}</h1>
    <h3 class="movie_ogtitle">${data.original_title}</h3>
    <a>
    <img src="${base_url}${data.poster_path}" alt="Poster"></img>
    </a>
    <p class="movie_overview">Overview: ${data.overview}</p>
    <p class="movie_genres">Genres: ${genreString}</p>
    <p class="movie_date">Release Date: ${data.release_date}</p>
    <p class="movie_runtime">Runnig Time: ${data.runtime}</p>
  </div>`;

  document.body.appendChild(movieInfo);
}