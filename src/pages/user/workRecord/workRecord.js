import "./workRecord.css";
import { Timer, Calender, Dashboard } from "@/components/WorkRecord/index.js";
import { getCurrentDate } from "@/utils/timeUtils";

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

  const currentTime = new Date();
  let { year: currentYear, month: currentMonth } = getCurrentDate();

  const renderComponent = (component, container) => {
    container.innerHTML = ""; // 기존 내용 지우기
    const element = component;
    container.appendChild(element);
  };

  const handleEndWork = () => {
    renderCalendar(); // 캘린더 리렌더링
    renderDashboard(); // 대시보드 리렌더링
  };

  // 캘린더의 날짜가 변경되면 대시보드 리렌더링
  const handleCalendarDateChange = (year, month) => {
    currentYear = year;
    currentMonth = month;
    renderDashboard();
  };

  const renderTimer = () => {
    const { element, clearTimer } = Timer({
      currentTime,
      workStart: null,
      workEnd: null,
      onEndWork: handleEndWork,
    });

    renderComponent(element, topLeftContainer);

    // 타이머 클리어 함수 저장
    return clearTimer;
  };

  const renderDashboard = () => {
    const { element } = Dashboard(currentYear, currentMonth);
    renderComponent(element, topRightContainer);
  };

  const renderCalendar = () => {
    const { element } = Calender(handleCalendarDateChange);
    renderComponent(element, bottomContainer);
  };

  // 초기 렌더링 메소드
  const initialize = () => {
    const clearTimer = renderTimer();
    renderDashboard();
    renderCalendar();

    // 컴포넌트 언마운트 시 타이머 클리어
    return () => {
      if (clearTimer) {
        clearTimer(); // 타이머 클리어 호출
      }
    };
  };

  const clearTimerOnUnmount = initialize(); // 초기화 호출

  // 언마운트 시 클리어 함수 호출
  window.addEventListener("beforeunload", clearTimerOnUnmount);
};

export default WorkRecord;
