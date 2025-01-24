import "./common.css";

import { router } from "@/router/router.js";

export function renderHeader() {
  return `
    <header id="header">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/admin/employee">관리자용</a></li>
          <li><a href="/user/profile">사용자용</a></li>
        </ul>
      </nav>
    </header>
  `;
}

export function initHeader() {
  const headerLinks = document.querySelectorAll("#header a");
  const currentPath = window.location.pathname; // 현재 URL 경로

  headerLinks.forEach((link) => {
    const linkPath = link.getAttribute("href"); // 링크의 href 속성값

    // 현재 경로에 따라 메뉴 항목을 활성화
    if (
      (currentPath === "/" && linkPath === "/") ||
      (currentPath.includes("/admin") && linkPath.includes("/admin")) ||
      (currentPath.includes("/user") && linkPath.includes("/user"))
    ) {
      link.classList.add("active"); // 해당 경로에 맞는 메뉴에 active 클래스 추가
    } else {
      link.classList.remove("active"); // active 클래스 제거
    }

    // 클릭 시 라우팅 처리
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      window.history.pushState({}, "", href);
      router(); // 라우터 호출
    });
  });
}
