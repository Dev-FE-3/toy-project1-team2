import { router } from "./router/router.js";

const app = async function () {
  await checkAuth();
  init();
  router();
};

//로그인 상태 확인
const checkAuth = function () {
  //로직 추가 필요
};

const init = function () {
  window.addEventListener("popstate", router);
};

document.addEventListener("DOMContentLoaded", app);
