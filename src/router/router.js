import profile from "@/pages/user/profile/profileDetail";
import notFound from "@/pages/notFound/notFound";
import notice from "@/pages/admin/notice/notice";
import write from "@/pages/admin/notice/write";
import detail from "@/pages/admin/notice/detail";
import record from "@/pages/user/workRecord/workRecord";
import employeeList from "@/pages/admin/employee/employeeList";
import employeeWrite from "@/pages/admin/employee/employeeWrite";
import employeeDetail from "@/pages/admin/employee/employeeDetail";
import profileWrite from "@/pages/user/profile/profileWrite";
import leave from "@/pages/user/leave/leaveList";
import leaveDetail from "@/pages/user/leave/leaveDetail";
import leaveApply from "@/pages/user/leave/leaveApply";
import leaveEdit from "@/pages/user/leave/leaveEdit";

import { renderHeader, initHeader } from "@/layout/header.js";
import { renderSidebar, initSidebar } from "@/layout/sidebar.js";

const routes = {
  "/": notice, // 기본 라우팅

  // 직원관리 페이지
  "/admin/employee": employeeList,
  "/admin/employee/write": employeeWrite,
  "/admin/employee/:id": employeeDetail,
  "/admin/employee/write/:id": employeeWrite,

  // 공지사항 페이지
  "/admin/notice": notice,
  "/notice": notice,
  "/notice/write": write,
  "/notice/detail/:id": detail,

  // 프로필 페이지
  "/user/profile": profile,
  "/user:id": profile,
  "/user/profile/write": profileWrite,

  "/user/record": record, // 근무관리 페이지

  // 휴가관리 페이지
  "/user/leave": leave,
  "/user/leave/apply": leaveApply,
  "/user/leave/:id/edit": leaveEdit,
  "/user/leave/:id": leaveDetail,
};

// :id와 같은 동적 라우팅을 처리하기 위해 경로를 정규식으로 변환
const getRouteRegex = (route) => route.replace(/:id/, "([\\w-]+)");

function renderLayout(container) {
  container.innerHTML = `
    ${renderHeader()}
    <div id="main-container">
      ${renderSidebar()}
      <main id="content"></main>
    </div>
  `;
}

const renderComponent = (route, container, id) => {
  try {
    // 공통 레이아웃 렌더링
    renderLayout(container);
    // 콘텐츠 영역에 컴포넌트 렌더링
    const content = document.querySelector("#content");
    routes[route](content, id); // 해당 컴포넌트 호출

    // 사이드바 초기화
    const sidebarContainer = document.querySelector("#sidebar");
    if (sidebarContainer) {
      sidebarContainer.innerHTML = renderSidebar();
      initSidebar(); // 새 링크에 이벤트 재설정
    }

    // 헤더 초기화
    initHeader(); // 헤더의 링크 클릭 이벤트 리스너 설정
  } catch (err) {
    console.error(err);
  }
};

export const router = function () {
  const path = window.location.pathname;
  const container = document.querySelector("#app");

  // 동적 라우팅 처리
  for (const route in routes) {
    const routeRegex = getRouteRegex(route);
    const match = path.match(new RegExp(`^${routeRegex}$`));

    if (match) {
      const id = match[1]; // 동적 부분 추출
      renderComponent(route, container, id);
      return;
    }
  }

  // 경로가 없을 경우 에러 처리 (공통 레이아웃 포함)
  renderLayout(container);
  const content = document.querySelector("#content");
  notFound(content);
};
