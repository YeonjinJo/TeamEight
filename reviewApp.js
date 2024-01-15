// 로컬 스토리지 활용법 → https://hianna.tistory.com/697

// 쿼리 선택자를 활용해 상수를 미리 선언합니다.
const form = document.querySelector(".reviewForm");
const alert = document.querySelector(".alert");
const review = document.getElementById("review");
const password = document.getElementById("reviewPW");
const submitButton = document.querySelector(".submitButton");
const container = document.querySelector(".reviewContainer");
const list = document.querySelector(".reviewList");
const weatherSeoul = document.querySelector(".weatherViewSeoul");
const weatherDaegu = document.querySelector(".weatherViewDaegu");
const weatherList = document.querySelector(".weatherList");

let editElement;
let editFlag = false;
let editID = "";

// 주요 이벤트에 대한 리스너를 설치하여 적절한 함수가 가동되도록 합니다.
password.addEventListener("input", addPW); // Password 작성
form.addEventListener("submit", addItem); // Review 작성
weatherSeoul.addEventListener("click", weatherAddSeoul);
weatherDaegu.addEventListener("click", weatherAddDaegu);
window.addEventListener("DOMContentLoaded", setupItems);

function addPW() {
  this.value = this.value.replace(/[^0-9]/g, ""); // 패스워드에는 숫자만 입력받을 수 있습니다.
}

function addItem(input) {
  input.preventDefault(); // 인풋 제출 시 자동으로 새로고침 되는 현상을 방지합니다.
  const value = review.value; // 리뷰 내용에 대한 변수를 설정합니다.
  const pwValue = password.value; // 패스워드 값에 대한 변수를 설정합니다.
  const id = new Date().getTime().toString(); // 고유 ID를 생성합니다.

  // 리뷰 칸과 패스워드 칸이 비어있지 않으면서, editFlag 값이 false이면 리뷰 내용이 신규 추가됩니다.
  if (value !== "" && pwValue !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id"); // 데이터셋 어트리뷰트를 생성합니다.
    attr.value = id; // 고유 ID를 부여합니다.
    element.setAttributeNode(attr);
    element.classList.add("reviewItem"); // 클래스 명이 reviewItem인 요소를 생성합니다.

    // 리뷰 내용과 수정, 삭제 버튼을 생성합니다.
    element.innerHTML = `
      <p class="reviewContent">${value}</p>
        <div class="buttonContainer">
          <button type="button" class="editButton">Modify</button>
          <button type="button" class="deleteButton">Delete</button>
        </div>`;

    const deleteButton = element.querySelector(".deleteButton");
    deleteButton.addEventListener("click", deleteCheck); // 삭제 버튼을 클릭하면 deleteCheck 함수를 실행합니다.
    const editButton = element.querySelector(".editButton");
    editButton.addEventListener("click", editItem); // 수정 버튼을 클릭하면 editItem 함수를 실행합니다.

    list.appendChild(element); // 부모 노드(list) 하에 자식 노드(element)를 추가합니다.

    displayAlert("Your review's been added to the list"); // 리뷰 추가가 완료되면 알림 문구가 나타납니다.
    addToLocalStorage(id, value, pwValue); // 로컬 스토리지에 데이터를 추가합니다.
    setBackToDefault(); // 초기화 함수(setBackToDefault)를 실행합니다.

    // 리뷰 칸과 패스워드 칸이 비어있지 않으면서, editFlag 값이 true이면 리뷰 내용이 수정됩니다.
  } else if (value !== "" && pwValue !== "" && editFlag) {
    editElement.innerHTML = value; // 수정된 리뷰 내용을 입력창에 입력합니다.
    displayAlert("Your review's been changed"); // 리뷰 수정이 완료되면 알림 문구가 나타납니다.
    editLocalStorage(editID, value, pwValue); // 로컬 스토리지의 데이터를 수정합니다.
    setBackToDefault(); // 초기화 함수(setBackToDefault)를 실행합니다.
  } else if (value !== "" && pwValue === "") {
    displayAlert("Please enter your password"); // 패스워드가 비어있으면, 입력을 요구하는 알림 문구가 나타납니다.
  } else {
    displayAlert("Please enter any comments"); // 리뷰가 비어있으면, 입력을 요구하는 알림 문구가 나타납니다.
  }
}

function displayAlert(text) {
  alert.textContent = text;
  setTimeout(function () {
    alert.textContent = "";
  }, 1500); // 알림 문구는 1.5초 간 유지합니다.
}

function deleteCheck(input) {
  const element = input.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  const items = getLocalStorage();

  const pwInput = prompt("Password");
  let pwOrigin = null;

  items.map(function (item) {
    if (item.id === id) {
      pwOrigin = item.pwValue;
    }
  });

  if (pwInput === pwOrigin) {
    deleteItem(element, id);
  } else {
    displayAlert("Wrong password!");
  }
}

function deleteItem(element, id) {
  list.removeChild(element); // 부모 노드(list) 하에 자식 노드(element)를 제거합니다.

  displayAlert("The review's been Removed"); // 리뷰 제거가 완료되면 알림 문구가 나타납니다.
  setBackToDefault(); // 초기화 함수(setBackToDefault)를 실행합니다.
  removeFromLocalStorage(id); // 로컬 스토리지의 데이터를 제거합니다.
}

function editItem(input) {
  const element = input.currentTarget.parentElement.parentElement; // 수정 타깃의 고유 ID를 찾아낼 수 있는 요소를 찾아갑니다.

  editElement = input.currentTarget.parentElement.previousElementSibling; // 수정 버튼으로부터 수정 타깃이 될 요소를 찾아갑니다.
  review.value = editElement.innerHTML; // 리뷰 내용을 수정한 내용으로 변경합니다.
  editFlag = true; // 수정 요청을 판별할 플래그 값을 true로 반환합니다.
  editID = element.dataset.id; // 수정할 리뷰의 ID 값을 불러옵니다.
  submitButton.textContent = "edit"; // 제출 버튼에 표시되는 문구를 edit로 설정합니다.
}

function setBackToDefault() {
  review.value = ""; // 리뷰 입력 창을 빈 칸으로 만듭니다.
  password.value = "";
  editFlag = false; // 수정 요청을 판별할 플래그 값을 false로 반환합니다.
  editID = ""; // 고유 ID를 할당할 변수를 비웁니다.
  submitButton.textContent = "submit"; // 제출 버튼에 표시되는 문구를 submit으로 설정합니다.
}

function addToLocalStorage(id, value, pwValue) {
  const review = { id, value, pwValue }; // 리뷰의 고유 ID와 내용을 변수에 할당합니다.
  let items = getLocalStorage(); // 로컬 스토리지를 불러옵니다.
  items.push(review); // 리뷰의 고유 ID와 내용을 로컬 스토리지에서 불러온 내용에 푸시합니다.
  localStorage.setItem("list", JSON.stringify(items)); // 로컬 스토리지에 데이터를 저장합니다.
}

function getLocalStorage() {
  // 로컬 스토리지를 불러옵니다.
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage(); // 로컬 스토리지를 불러옵니다.

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    } // 제거할 리뷰의 ID를 제외한 ID 값으로 필터링합니다.
  });
  localStorage.setItem("list", JSON.stringify(items)); // 로컬 스토리지에 데이터를 저장합니다.
}

function editLocalStorage(id, value) {
  let items = getLocalStorage(); // 로컬 스토리지를 불러옵니다.

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    } // 수정할 리뷰의 ID와 일치하는 ID의 데이터를 수정합니다.
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items)); // 로컬 스토리지에 데이터를 저장합니다.
}

function setupItems() {
  let items = getLocalStorage(); // 로컬 스토리지를 불러옵니다.

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value); // 불러온 아이템을 리스트업 합니다.
    });
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id"); // 데이터셋 어트리뷰트를 생성합니다.
  attr.value = id; // 고유 ID를 부여합니다.
  element.setAttributeNode(attr);
  element.classList.add("reviewItem"); // 클래스 명이 reviewItem인 요소를 생성합니다.

  // 리뷰 내용과 수정, 삭제 버튼을 생성합니다.
  element.innerHTML = `
    <p class="reviewContent">${value}</p>
      <div class="buttonContainer">
        <button type="button" class="editButton">Modify</button>
        <button type="button" class="deleteButton">Delete</button>
      </div>
    `;
  const deleteButton = element.querySelector(".deleteButton");
  deleteButton.addEventListener("click", deleteCheck); // 삭제 버튼을 클릭하면 deleteItem 함수를 실행합니다.
  const editButton = element.querySelector(".editButton");
  editButton.addEventListener("click", editItem); // 수정 버튼을 클릭하면 editItem 함수를 실행합니다.

  list.appendChild(element); // 부모 노드(list) 하에 자식 노드(element)를 추가합니다.
}

function weatherAddSeoul() {
  const seoulLocation = [
    { district: "종로구", X: 60, Y: 127 },
    { district: "중구", X: 60, Y: 127 },
    { district: "용산구", X: 60, Y: 126 },
    { district: "성동구", X: 61, Y: 127 },
    { district: "광진구", X: 62, Y: 126 },
    { district: "동대문구", X: 61, Y: 127 },
    { district: "중랑구", X: 62, Y: 128 },
    { district: "성북구", X: 61, Y: 127 },
    { district: "강북구", X: 61, Y: 128 },
    { district: "도봉구", X: 61, Y: 129 },
    { district: "노원구", X: 61, Y: 129 },
    { district: "은평구", X: 59, Y: 127 },
    { district: "서대문구", X: 59, Y: 127 },
    { district: "마포구", X: 59, Y: 127 },
    { district: "양천구", X: 58, Y: 126 },
    { district: "강서구", X: 58, Y: 126 },
    { district: "구로구", X: 58, Y: 125 },
    { district: "금천구", X: 59, Y: 124 },
    { district: "영등포구", X: 58, Y: 126 },
    { district: "동작구", X: 59, Y: 125 },
    { district: "관악구", X: 59, Y: 125 },
    { district: "서초구", X: 61, Y: 125 },
    { district: "강남구", X: 61, Y: 126 },
    { district: "송파구", X: 62, Y: 126 },
    { district: "강동구", X: 62, Y: 126 },
  ]; // 서울 지역구 별 고유 좌표값을 선언합니다.

  seoulLocation.forEach((element) => {
    const district = element["district"]; // 지역구 명칭을 불러옵니다.
    const xAxis = element["X"].toString(); // 지역구에 대한 X 좌표를 불러옵니다.
    const yAxis = element["Y"].toString(); // 지역구에 대한 Y 좌표를 불러옵니다.

    const today = new Date(); // 현재 날짜 및 시간을 상수로 선언합니다.

    const year = today.getFullYear(); // 연도를 네 자리 숫자로 불러옵니다.
    const month = today.getMonth() + 1;
    const month00 = ("00" + month.toString()).slice(-2); // 월을 두 자리 숫자로 나타냅니다.
    const day = today.getDate();
    const day00 = ("00" + day.toString()).slice(-2); // 일을 두 자리 숫자로 나타냅니다.

    const date = year.toString() + month00 + day00; // 날짜 문자열을 생성합니다.

    const hour = today.getHours() - 1;
    const hour00 = ("00" + hour.toString()).slice(-2) + "00"; // 시를 두 자리 숫자로 나타냅니다.
    // 기상청 초단기 실황 조회는 한 시간 단위로 업데이트 되기 때문에 분 정보는 필요 없습니다.

    // 공공데이터포털 기상청 단기예보 OpenAPI에 접근합니다.
    const weatherInfo =
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?" +
      "serviceKey=0Mq3Ijf%2F1TE4qQTq8b5FEIzqb6M2keb9pboiQ3iDj1gY2vu97uq6rR%2BYHc7ETL7YV8PfY7F2Q9TZ6AUnbP9NUg%3D%3D" +
      "&pageNo=1&numOfRows=10" +
      "&dataType=JSON" +
      "&base_date=" +
      date +
      "&base_time=" +
      hour00 +
      "&nx=" +
      xAxis +
      "&ny=" +
      yAxis;

    while (weatherList.firstChild) {
      weatherList.removeChild(weatherList.firstChild); // 날씨 리스트의 내용을 비워줍니다.
    }

    fetch(weatherInfo)
      .then((res) => res.json())
      .then((data) => {
        let temperature =
          data["response"]["body"]["items"]["item"]["3"]["obsrValue"]; // 실황 데이터 중 기온 정보를 가져옵니다.
        let tempHtml = `
      <p>${year}년 ${month00}월 ${day00}일 ${hour}시 기준,
      서울 ${district}의 현재 기온은 ${temperature}℃입니다.</p>`;

        weatherList.insertAdjacentHTML("beforeend", tempHtml); // weatherList에 만들어낸 문구를 삽입합니다.
      });
  });
}

function weatherAddDaegu() {
  const daeguLocation = [
    { district: "중구", X: 89, Y: 90 },
    { district: "동구", X: 90, Y: 91 },
    { district: "서구", X: 88, Y: 90 },
    { district: "남구", X: 89, Y: 90 },
    { district: "북구", X: 89, Y: 91 },
    { district: "수성구", X: 89, Y: 90 },
    { district: "달서구", X: 88, Y: 90 },
    { district: "달성군", X: 86, Y: 88 },
    { district: "군위군", X: 88, Y: 99 },
  ]; // 대구 지역구 별 고유 좌표값을 선언합니다.

  daeguLocation.forEach((element) => {
    const district = element["district"]; // 지역구 명칭을 불러옵니다.
    const xAxis = element["X"].toString(); // 지역구에 대한 X 좌표를 불러옵니다.
    const yAxis = element["Y"].toString(); // 지역구에 대한 Y 좌표를 불러옵니다.

    const today = new Date(); // 현재 날짜 및 시간을 상수로 선언합니다.

    const year = today.getFullYear(); // 연도를 네 자리 숫자로 불러옵니다.
    const month = today.getMonth() + 1;
    const month00 = ("00" + month.toString()).slice(-2); // 월을 두 자리 숫자로 나타냅니다.
    const day = today.getDate();
    const day00 = ("00" + day.toString()).slice(-2); // 일을 두 자리 숫자로 나타냅니다.

    const date = year.toString() + month00 + day00; // 날짜 문자열을 생성합니다.

    const hour = today.getHours() - 1;
    const hour00 = ("00" + hour.toString()).slice(-2) + "00"; // 시를 두 자리 숫자로 나타냅니다.

    // 공공데이터포털 기상청 단기예보 OpenAPI에 접근합니다.
    const weatherInfo =
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?" +
      "serviceKey=0Mq3Ijf%2F1TE4qQTq8b5FEIzqb6M2keb9pboiQ3iDj1gY2vu97uq6rR%2BYHc7ETL7YV8PfY7F2Q9TZ6AUnbP9NUg%3D%3D" +
      "&pageNo=1&numOfRows=10" +
      "&dataType=JSON" +
      "&base_date=" +
      date +
      "&base_time=" +
      hour00 +
      "&nx=" +
      xAxis +
      "&ny=" +
      yAxis;

    while (weatherList.firstChild) {
      weatherList.removeChild(weatherList.firstChild); // 날씨 리스트의 내용을 비워줍니다.
    }

    fetch(weatherInfo)
      .then((res) => res.json())
      .then((data) => {
        let temperature =
          data["response"]["body"]["items"]["item"]["3"]["obsrValue"]; // 실황 데이터 중 기온 정보를 가져옵니다.
        let tempHtml = `
      <p>${year}년 ${month00}월 ${day00}일 ${hour}시 기준,
      대구 ${district}의 현재 기온은 ${temperature}℃입니다.</p>`;

        weatherList.insertAdjacentHTML("beforeend", tempHtml); // weatherList에 만들어낸 문구를 삽입합니다.
      });
  });
}
