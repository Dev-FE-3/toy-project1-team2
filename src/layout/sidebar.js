import "./common.css";
import { router } from "@/router/router.js";

// 사이드바 메뉴 데이터
const sidebarMenus = {
  "/admin": [
    { label: "직원관리", href: "/admin/employee" },
    { label: "공지사항관리", href: "/admin/notice" },
  ],
  "/user": [
    { label: "프로필", href: "/user/profile" },
    { label: "근무관리", href: "/user/record" },
    { label: "휴가관리", href: "/user/leave" },
  ],
};

// URL에 따른 사이드바 메뉴 반환
function getSidebarMenu(path) {
  const matchingKey = Object.keys(sidebarMenus).find((key) =>
    path.startsWith(key)
  );

  return sidebarMenus[matchingKey] || [];
}

// 사이드바 렌더링 함수
export function renderSidebar() {
  const path = window.location.pathname;
  const menuItems = getSidebarMenu(path);

  const menuHtml = menuItems
    .map(
      (item) => `
        <li>
          <a href="${item.href}">${item.label}</a>
        </li>
      `
    )
    .join("");

  return `
    <aside id="sidebar">
      <ul>
        ${menuHtml}
      </ul>
    </aside>
  `;
}

export function initSidebar() {
  const sidebarContainer = document.querySelector("#sidebar");
  const sidebarLinks = sidebarContainer.querySelectorAll("a");
  const path = window.location.pathname;

  // 기존 링크 이벤트 제거 후 새로 추가
  sidebarLinks.forEach((link) => {
    // URL에 맞는 항목을 찾아 active 클래스 추가
    if (
      (path.startsWith("/admin/employee") &&
        link.getAttribute("href").includes("employee")) ||
      (path.startsWith("/admin/notice") &&
        link.getAttribute("href").includes("notice")) ||
      (path.startsWith("/user/profile") &&
        link.getAttribute("href").includes("profile")) ||
      (path.startsWith("/user/record") &&
        link.getAttribute("href").includes("record")) ||
      (path.startsWith("/user/leave") &&
        link.getAttribute("href").includes("leave"))
    ) {
      link.classList.add("active"); // 현재 URL에 해당하는 링크에 'active' 클래스 추가
    } else {
      link.classList.remove("active"); // 'active' 클래스 제거
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      window.history.pushState({}, "", href);

      // URL 변경 후 라우터 호출
      router();
    });
  });
}
