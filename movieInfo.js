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
  let movieContainer = document.querySelector(".movieInfoContainer");
  const movieInfo = document.createElement("div");

  const movieGenres = data.genres.map(genre => genre.name);
  const genreString = movieGenres.join(', ');

  movieInfo.innerHTML = `
  <div class="card mb-3">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${base_url}${data.poster_path}" class="img-fluid rounded-start movieImg" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body movie_info_body">
        <h1 class="card-title movie_title">${data.title}</h1>
        <h5 class="movie_ogtitle">${data.original_title}</h5>
        <p class="card-text movie_overview">Overview : <br>${data.overview}</p>
        <p class="movie_genres">Genres : ${genreString}</p>
        <p class="movie_date">Release Date : ${data.release_date}</p>
        <p class="movie_runtime">Runnig Time : ${data.runtime} min</p>
        <p class="card-text movie_id"><small class="text-body-secondary">ID : ${data.id}</small></p>
      </div>
    </div>
  </div>
</div>`;

  movieContainer.appendChild(movieInfo);
}

const backMovieInfo = document.getElementById("backBtn").addEventListener("click", () => {
  javascript:window.history.back();
})