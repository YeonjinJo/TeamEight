const toggleBtn = document.querySelector("#toggle_button");
const toggleRegion = document.querySelector(".search");

function clickHandler() {
  const current_status = toggleRegion.style.display;

  if (current_status === "none") {
    toggleRegion.style.display = "flex";
  } else {
    toggleRegion.style.display = "none";
  }
}

toggleBtn.addEventListener("click", clickHandler);

const searchButton = document.getElementById("search_button");
searchButton.addEventListener("click", searchHandler);

const searchEnter = document.getElementById("search_input");
searchEnter.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchHandler();
  }
});

/* Yeonjin Theatre 클릭시 새로고침 기능 */
function reloadPage() {
  location.reload();
}
