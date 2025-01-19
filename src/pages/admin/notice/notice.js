import { createButton } from "@/components/Button/button.js";
import { createInputField } from "@/components/InputField/input.js";
import "./notice.css";

export default function notice(contents) {
  const submitButton = createButton("등록", () => console.log("클릭"), [
    "btn--submit",
  ]);
  const deleteButton = createButton("삭제", () => console.log("클릭"), [
    "btn--delete",
  ]);

  const searchInput = createInputField({
    type: "search",
    attributes: {
      name: "search",
      id: "search",
    },
    datasets: { required: true, validation: true },
  });

  // 현재 페이지가 관리자용의 '공지사항관리' 페이지인지 확인
  const isAdminNoticePage = window.location.pathname === "/admin/notice";

  contents.innerHTML = `
  <section class="wrapper">
    <header>
        <div class="left">
          <h1>공지사항 관리</h1>
          ${
            isAdminNoticePage
              ? `
              <div class="allCheckButton">
                <img
                  src="https://github.com/user-attachments/assets/34bd4a1e-73f1-4ef8-896c-1aad0c1fed99"
                  class="checkBox"
                />
                <p>전체선택</p>
              </div>`
              : ""
          }
        </div>

        <div class="right">
          ${searchInput.outerHTML}

          <div class="action-buttons">
            ${isAdminNoticePage ? submitButton.outerHTML : ""}
            ${isAdminNoticePage ? deleteButton.outerHTML : ""}
          </div>

          <div> 
            <img src="https://github.com/user-attachments/assets/1dae0ec4-db39-49a3-b720-925fa237e33f" alt="list" class="changeButton"/>
          </div>
        
        </div>
      </header>
      <section>
        <ul class="gallery-list">
          <!-- JSON 데이터가 동적으로 삽입될 부분 -->
        </ul>
      </section>
    </section>
    `;

  // JSON 데이터 로드
  let noticesData = [];
  fetch("/src/data/notices.json")
    .then((response) => response.json())
    .then((data) => {
      noticesData = data;
      displayNotices(data); // 초기 데이터 표시
    })
    .catch((error) => {
      console.error("Error loading JSON:", error);
    });

  // 검색 입력 이벤트 처리
  const searchEl = document.getElementById("search");

  searchEl.addEventListener("input", function () {
    const searchTerm = searchEl.value.toLowerCase(); // 소문자로 변환하여 검색

    const filteredNotices = noticesData.filter(
      (notice) =>
        notice.title.toLowerCase().includes(searchTerm) ||
        notice.contents.toLowerCase().includes(searchTerm)
    );

    // 검색 결과 출력
    displayNotices(filteredNotices);
  });

  // 공지사항을 갤러리 리스트로 출력하는 함수
  function displayNotices(data) {
    const galleryList = document.querySelector(".gallery-list");
    const list = document.querySelector(".list");

    const noticesHTML = data
      .map(
        (item) => `
        <li class="list-item">
          <div class="text">
            <div class="date">${item.date}</div>
            <div class="title">${item.title.length > 14 ? item.title.substring(0, 14) + "..." : item.title}</div>
            <div class="contents">${item.contents.length > 50 ? item.contents.substring(0, 50) + "..." : item.contents}</div>
          </div>
          <div class="img"><img src="${item.imgSrc}" alt="notice image"/></div>
        </li>
      `
      )
      .join("");

    // 갤러리 모드
    if (galleryList && galleryList.classList.contains("gallery-list")) {
      galleryList.innerHTML = noticesHTML;
    }

    // 리스트 모드
    if (list && list.classList.contains("list")) {
      list.innerHTML = noticesHTML;
    }
  }

  // allCheckButton 클릭 시 아이콘 변경 로직 추가. off <-> on
  const allCheckButton = document.querySelector(".allCheckButton");
  const checkBox = document.querySelector(".checkBox");
  if (allCheckButton && checkBox) {
    allCheckButton.addEventListener("click", function () {
      const currentSrc = checkBox.src;

      if (currentSrc.includes("34bd4a1e-73f1-4ef8-896c-1aad0c1fed99")) {
        checkBox.src =
          "https://github.com/user-attachments/assets/68846971-a34b-4d1f-bc01-2422f4f5e8da"; // 새로운 아이콘 경로로 변경
      } else {
        checkBox.src =
          "https://github.com/user-attachments/assets/34bd4a1e-73f1-4ef8-896c-1aad0c1fed99"; // 원래 아이콘으로 돌아가기
      }
    });
  }

  // changeButton 클릭 시 갤러리 보기 방식 변경
  const changeButton = document.querySelector(".changeButton");
  const galleryList = document.querySelector("ul");

  if (changeButton && galleryList) {
    changeButton.addEventListener("click", function () {
      console.log("changeButton clicked");
      if (galleryList.classList.contains("gallery-list")) {
        galleryList.classList.remove("gallery-list");
        galleryList.classList.add("list");
        changeButton.src =
          "https://github.com/user-attachments/assets/3f2ccbf5-9c2e-4284-858b-c4ef0aad4f94"; // 새로운 아이콘 경로로 변경
      } else {
        galleryList.classList.remove("list");
        galleryList.classList.add("gallery-list");
        changeButton.src =
          "https://github.com/user-attachments/assets/1dae0ec4-db39-49a3-b720-925fa237e33f"; // 원래 아이콘으로 돌아가기
      }
    });
  } else {
    console.warn("changeButton or galleryList not found.");
  }
}
