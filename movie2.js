const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjhhYzIzOGVmMTA2YjhmNGM2MGNlZjk2MjU5NWJjYiIsInN1YiI6IjY1OGU3OTNjZDdkY2QyMGQ2MGVhZjVjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ISlfZIi8alvNiRWhBDbv27ZhCBfS-RadxHs-t4Fg0VA",
  },
};

const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
const base_url = "https://image.tmdb.org/t/p/w500";

window.onload = function () {
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      loadMovies(data);
    });
};
function loadMovies(data) {
  for (let i = 0; i < data["results"]["length"]; i++) {
    const title = data["results"][i]["title"];
    let overview = data["results"][i]["overview"];
    const overviewWordArray = overview.split(" ");

    if (overviewWordArray.length > 40) {
      let overviewProcessing = overview.split(" ", 40);
      str = overviewProcessing.join(" ");
      overview = str.concat(" (...)");
    }

    const poster = data["results"][i]["poster_path"];
    const voteRate = data["results"][i]["vote_average"];

    const tempHtml = `
    <div class="content_${i}" id="card_${i}" style="grid-area: d${i};">
      <div class="movie_title">${title}</div>
      <div class="movie_overview">${overview}</div>
      <div class="movie_title">${voteRate}</div>
      <a href="info.html">
        <img src="${base_url}${poster}" alt="Poster [${title}]" style="width: 100%;">
      </a>
    </div>`;

    const element = document.querySelector("#value");
    element.insertAdjacentHTML("beforeend", tempHtml);
  }
}
const count = document.getElementById("search_input");
count.addEventListener("keyup", function (e) {
  let content = $(this).val();
  $('#counter').html(`(${content.length} / 20)`);    //글자수 실시간 카운팅
  if (content.length > 20) {
    alert("최대 20자까지 입력 가능합니다.");  
    $(this).val(content.substring(0, 20));
    $('#counter').html("(20 / 20)");
  }
});

function searchHandler() {
  fetch(url, options).then((res) => res.json()).then((data) => {
    const node_list = document.getElementsByName("searchCond");
    const keyword = document.getElementById("search_input").value;
    const special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    const blank_pattern = /^\s+|\s+$/g;

    let searchCond = "empty";

    node_list.forEach((node) => {
      if (node.checked) {
        searchCond = node.value;
        let checker = false;
        if (searchCond === "title") {
          if (special_pattern.test(keyword)) {
            return alert('특수문자가 입력되었습니다.');
          }
          for (let i = 0; i < data["results"]["length"]; i++) {
            const title = data["results"][i]["title"];
            const titleWordArray = title.split(" ");
            const result = titleWordArray.find(t => { return t === keyword; });

            const idNum = data["results"][i]["id"];
            const poster = data["results"][i]["poster_path"];

            if (result) {
              showModal(base_url, poster, title, idNum);
              checker = true;
            }
          }
        }
        if (searchCond === "content") {
          if (special_pattern.test(keyword)) {
            return alert('특수문자가 입력되었습니다.');
          }
          for (let i = 0; i < data["results"]["length"]; i++) {
            const idNum = data["results"][i]["id"];
            const poster = data["results"][i]["poster_path"];

            const title = data["results"][i]["title"];
            const overview = data["results"][i]["overview"];
            const overviewWordArray = overview.split(" ");
            const result = overviewWordArray.find(t => { return t === keyword; });

            if (result) {
              showModal(base_url, poster, title, idNum);
              checker = true;
            }
          }
        }

        if (keyword.replace(blank_pattern, '') === "") {
          return alert("공백 입니다");
        }
        if (!checker) {
          return alert("검색 결과가 없습니다.");
        }

      }

    })

    if (searchCond === "empty") { alert("검색 조건을 선택하세요."); }

  })
}

function showModal(base_url, poster, title, idNum) {
  const existingModal = document.querySelector(".modal");
  if (existingModal) { existingModal.remove(); }

  const modal = document.createElement("div");
  modal.className = "modal hidden";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content zoomIn";

  const image = document.createElement("div");
  image.style.backgroundImage = `url(${base_url}${poster})`;
  image.alt = "Door Image";

  const textElement1 = document.createElement("p");
  textElement1.textContent = `${idNum} → ${title}`;

  modalContent.appendChild(image);
  modalContent.appendChild(textElement1);

  modal.appendChild(modalContent);
  modal.addEventListener("click", () => {
    modal.remove();
  });

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.remove("hidden"), 0);
}

