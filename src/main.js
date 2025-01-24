import "./css/global.css";
import { router } from "./router/router.js";
import { WORK_RECORD_URL, WORK_RECORD_KEY } from "@/constants/constants.js";

const app = async function () {
  await checkAuth();
  init();
  initializeLocalStorage(); // 로컬스토리지 초기화 함수 호출
  router();
};

//로그인 상태 확인
const checkAuth = function () {
  //로직 추가 필요
};

const init = function () {
  window.addEventListener("popstate", router);
};

// 로컬스토리지 초기화 함수
const initializeLocalStorage = function () {
  // 공지사항 json 파일 load
  fetch("/src/data/notices.json")
    .then((response) => response.json())
    .then((data) => {
      if (localStorage.getItem("notices")) {
        return;
      }
      localStorage.setItem("notices", JSON.stringify(data));
    })
    .catch((error) => {
      console.error("Error loading JSON:", error);
    });

  fetch(WORK_RECORD_URL)
    .then((response) => response.json())
    .then((data) => {
      if (localStorage.getItem(WORK_RECORD_KEY)) {
        return;
      }
      localStorage.setItem(WORK_RECORD_KEY, JSON.stringify(data));

      // 직원관리 json 파일 load
      fetch("/src/data/employees.json")
        .then((response) => response.json())
        .then((data) => {
          if (localStorage.getItem("employees")) {
            return;
          }
          localStorage.setItem("employees", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error loading JSON:", error);
        });
    });

    // 휴가관리 json 파일 load
    fetch('/src/data/leaves.json')
    .then((response) => response.json())
    .then((data) => {
      if (localStorage.getItem("leaves")) {
        return;
      }
      localStorage.setItem("leaves", JSON.stringify(data));
    })
    .catch((error) => {
      console.error("Error loading JSON:", error);
    });

};

document.addEventListener("DOMContentLoaded", app);
