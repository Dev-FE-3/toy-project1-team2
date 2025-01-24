import "./workRecord.css";
import { Timer, Calender, Dashboard } from "@/components/WorkRecord/index.js";

const WorkRecord = (contents) => {
  contents.innerHTML = `
        <div class="wrapper">
          <div class="header">
            <h2 class="header__title">근무관리</h2>
          </div>
          <section>
            <div id="top-container">
              <div id="top-left"></div>
              <div id="top-right"></div>
            </div>
            <div id="bottom-container"></div>
          </section>
        </div>
      `;

  const topLeftContainer = document.getElementById("top-left");
  const topRightContainer = document.getElementById("top-right");
  const bottomContainer = document.getElementById("bottom-container");

  // 현재 시간에서 년도와 월을 가져옵니다.
  let currentTime = new Date();
  let currentYear = currentTime.getFullYear(); // 현재 년도
  let currentMonth = currentTime.getMonth() + 1; // 현재 월 (0부터 시작하므로 1을 더함)

  const renderComponent = (component, container, year, month) => {
    container.innerHTML = ""; // 기존 내용 지우기
    const element = component(year, month);
    container.appendChild(element);
  };

  const renderDashboard = (year, month) => {
    currentYear = year;
    currentMonth = month;
    renderComponent(Dashboard, topRightContainer, year, month);
  };

  const renderCalendar = () => {
    renderComponent(Calender, bottomContainer, renderDashboard); // renderDashboard 전달
  };

  // 초기 대시보드와 캘린더 렌더링
  renderDashboard(currentYear, currentMonth);
  renderCalendar();

  const handleEndWork = () => {
    renderCalendar(); // 캘린더 리렌더링
    renderDashboard(currentYear, currentMonth); // 대시보드 리렌더링
  };

  // Timer 인스턴스 생성
  const timer = Timer({
    currentTime,
    workStart: null,
    workEnd: null,
    onEndWork: handleEndWork,
  });

  topLeftContainer.appendChild(timer.timerHTML);

  // 현재 시각 업데이트
  setInterval(() => {
    currentTime = new Date(); // 현재 시각 업데이트
    timer.updateCurrentTime(currentTime); // Timer에 현재 시각 업데이트
  }, 1000);
};

export default WorkRecord;
