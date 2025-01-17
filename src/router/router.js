import home from "../pages/home/home";
import profile from "../pages/user/profile/profile";
import notFound from "../pages/notFound/notFound";

const routes = {
  "/": home,
  "/user/:id": profile,
};

const getRouteRegex = (route) => route.replace(/:id/, "([\\w-]+)");

export const router = function () {
  const path = window.location.pathname;
  const container = document.querySelector("#app");

  // 동적 라우팅 처리
  for (const route in routes) {
    const routeRegex = getRouteRegex(route);
    const match = path.match(new RegExp(`^${routeRegex}$`));

    if (match) {
      const id = match[1]; // 동적 부분 추출
      try {
        routes[route](container, id); // 해당 컴포넌트 호출
      } catch (err) {
        error(container, err); // 호출 중 에러가 발생한 경우 처리
      }
      return;
    }
  }

  // 경로가 없을 경우 에러 처리
  notFound(container);
};
