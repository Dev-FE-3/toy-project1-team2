import "./notice.css";

import { createButton } from "@/components/Button/button.js";
import { createInputField } from "@/components/InputField/input.js";

const CHECKED_ICON_URL =
  "https://github.com/user-attachments/assets/68846971-a34b-4d1f-bc01-2422f4f5e8da";
const UNCHECKED_ICON_URL =
  "https://github.com/user-attachments/assets/34bd4a1e-73f1-4ef8-896c-1aad0c1fed99";
const VIEW_ICON_URL =
  "https://github.com/user-attachments/assets/3f2ccbf5-9c2e-4284-858b-c4ef0aad4f94";
const LIST_ICON_URL =
  "https://github.com/user-attachments/assets/1dae0ec4-db39-49a3-b720-925fa237e33f";

const notice = (contents) => {
  const submitButton = createButton(
    "등록",
    () => {
      window.location.href = "/notice/write"; // 등록 버튼 클릭 시 등록 페이지로 이동
    },
    ["btn--submit"]
  );

  const deleteButton = createButton(
    "삭제",
    () => console.log("삭제 버튼 클릭"),
    ["btn--delete"]
  );

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
    <header class="header">
        <div class="left">
          <h1 class="header__title">공지사항 관리</h1>
          ${
            isAdminNoticePage
              ? `
              <div class="allCheckButton">
                <img
                  src=${UNCHECKED_ICON_URL}
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
             <!-- 버튼을 여기에 추가할 예정 -->
          </div>
          <div> 
            <img src=${LIST_ICON_URL} alt="list" class="changeButton"/>
          </div>
        
        </div>
      </header>
      <section class="list-contents">
        <ul class="gallery-list">
          <!-- JSON 데이터가 동적으로 삽입될 부분 -->
        </ul>
      </section>
    </section>
    `;

  // 버튼 DOM에 직접 추가
  if (isAdminNoticePage) {
    const buttonContainer = contents.querySelector(".action-buttons");
    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(deleteButton);
  }

  // JSON 데이터 로드
  let noticesData = JSON.parse(localStorage.getItem("notices")) || [];
  displayNotices(noticesData);
  addClickEventToItems();

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

  // 공지사항을 출력하는 함수
  function displayNotices(data) {
    const galleryList = document.querySelector(".gallery-list");
    const list = document.querySelector(".list");

    const noticesHTML = data
      .map((item) => {
        // 날짜 포맷팅 ex) 2025.01.21
        const date = new Date(item.date);
        const formattedDate =
          date.getFullYear() +
          "." +
          String(date.getMonth() + 1).padStart(2, "0") +
          "." +
          String(date.getDate()).padStart(2, "0");

        let imageSrc = "../../public/imgs/images.jpg";
        if (
          item.imgSrc &&
          item.imgSrc.length > 0 &&
          Array.isArray(item.imgSrc)
        ) {
          const validImage = item.imgSrc.find((img) =>
            /\.(jpg|jpeg|png)$/i.test(img.src)
          ); // JPG 또는 PNG 파일 찾기
          if (validImage) {
            imageSrc = validImage.src; // 첫 번째 유효한 이미지
          }
        }

        return `
        <li class="list-item" data-id="${item.id}">
          <div class="text">
            <div class="date">${formattedDate}</div> 
            <div class="title">${item.title.length > 14 ? item.title.substring(0, 14) + "..." : item.title}</div>
            <div class="contents">
              ${item.contents && item.contents.length > 50 ? item.contents.substring(0, 50) + "..." : item.contents || ""}
            </div>
          </div>
          <div class="img"><img src="${imageSrc}" alt="notice image"/></div>
        </li>
      `;
      })
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

  function addClickEventToItems() {
    const listItems = document.querySelectorAll(".list-item");
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        const noticeId = item.dataset.id; // data-id 가져오기
        window.location.href = `/notice/detail/${noticeId}`; // URL 파라미터로 전달
      });
    });
  }

  // 전체선택 버튼 클릭 시 아이콘 변경 로직
  const allCheckButton = document.querySelector(".allCheckButton");
  const checkBox = document.querySelector(".checkBox");
  if (allCheckButton && checkBox) {
    allCheckButton.addEventListener("click", function () {
      const currentSrc = checkBox.src;

      if (currentSrc.includes("34bd4a1e-73f1-4ef8-896c-1aad0c1fed99")) {
        checkBox.src = CHECKED_ICON_URL; // 새로운 아이콘 경로로 변경
      } else {
        checkBox.src = UNCHECKED_ICON_URL; // 원래 아이콘으로 돌아가기
      }
    });
  }

  // changeButton 클릭 시 목록 보기 방식  변경
  const changeButton = document.querySelector(".changeButton");
  const galleryList = document.querySelector("ul");

  if (changeButton && galleryList) {
    changeButton.addEventListener("click", function () {
      if (galleryList.classList.contains("gallery-list")) {
        galleryList.classList.remove("gallery-list");
        galleryList.classList.add("list");
        changeButton.src = VIEW_ICON_URL; // 새로운 아이콘 경로로 변경
      } else {
        galleryList.classList.remove("list");
        galleryList.classList.add("gallery-list");
        changeButton.src = LIST_ICON_URL; // 원래 아이콘으로 돌아가기
      }
    });
  } else {
    console.warn("changeButton or galleryList not found.");
  }
};

export default notice;
