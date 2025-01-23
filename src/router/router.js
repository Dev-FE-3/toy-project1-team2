import home from "@/pages/home/home";
import profile from "@/pages/user/profile/profile";
import notFound from "@/pages/notFound/notFound";
import notice from "@/pages/admin/notice/notice";
import write from "@/pages/admin/notice/write";
import leave from "@/pages/user/leave/leaveList";
import leaveDetail from "@/pages/user/leave/leaveDetail";
import leaveApply from "@/pages/user/leave/leaveApply";
import leaveEdit from "@/pages/user/leave/leaveEdit"

const routes = {
  "/": home, //기본 라우팅
  "/user:id": profile, //동적 라우팅 사용을 위해서는 경로 뒤에 /:id를 추가해서 사용
  "/admin/notice": notice,
  "/notice": notice,
  "/notice/write": write,
  "/leave": leave,
  "/leave/apply": leaveApply,
  ".leave/:id/edit": leaveEdit,
  "/leave/:id": leaveDetail,
};

const getRouteRegex = (route) => route.replace(/:id/, "([\\w-]+)");

const renderComponent = (route, container, id) => {
  try {
    routes[route](container, id); // 해당 컴포넌트 호출
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

  // 경로가 없을 경우 에러 처리
  notFound(container);
};
