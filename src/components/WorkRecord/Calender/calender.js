import "./calender.css";
import { fetchFromLocalStorage } from "@/utils/storageUtils";
import { formatTime, parseDateTimeString } from "@/utils/timeUtils";
import { WORK_RECORD_KEY } from "@/constants/constants";

// 상수 정의
const WEEK_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const EVENT_CLASSES = {
  근무: "event--normal",
  지각: "event--late",
  조퇴: "event--leave",
};

export function Calender(updateDashboard) {
  // 현재 날짜 상태
  const currentDate = new Date();

  //이벤트 가져오기
  const events = fetchFromLocalStorage(WORK_RECORD_KEY);

  //UI 그리기
  const calendarHTML = createCalendarHTML(currentDate, events);

  //버튼 이벤트 등록하기
  addEventListeners(calendarHTML, currentDate, events, updateDashboard);

  return { element: calendarHTML };
}

// 캘린더 생성 함수
const createCalendarHTML = (currentDate, events) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const calendarHTML = document.createElement("div");
  calendarHTML.id = "calendar-container";
  calendarHTML.innerHTML = `
      <div class="calendar">
        ${createCalendarHeaderHTML(currentYear, currentMonth)}
        <div class="calendar-grid">
          ${createCalendarGridHTML(currentDate, events)}
        </div>
      </div>
  `;

  return calendarHTML;
};

// 캘린더 헤더 생성
const createCalendarHeaderHTML = (year, month) => `
  <div class="calendar-header">
    <button class="calendar-button" aria-label="이전달" id="prev-button">
      <span class="material-icons">keyboard_arrow_left</span>
    </button>
    <h2 class="calendar-title">${year}년 ${month}월</h2>
    <button class="calendar-button" aria-label="다음달" id="next-button">
      <span class="material-icons">keyboard_arrow_right</span>
    </button>
  </div>
`;

// 캘린더 그리드 생성
const createCalendarGridHTML = (currentDate, events) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const emptyCells = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return `
    ${WEEK_NAMES.map((name) => `<div class="weekday-header">${name}</div>`).join("")}
    ${Array.from({ length: emptyCells })
      .map((_, index) => `<div key="empty-${index}" class="day-cell"></div>`)
      .join("")}
    ${days.map((day) => renderEventsHTML(day, currentYear, currentMonth + 1, events)).join("")}
  `;
};

// 이벤트 렌더링 함수
const renderEventsHTML = (day, year, month, events) => {
  const event = events.find((e) => {
    const {
      year: eventYear,
      month: eventMonth,
      day: eventDay,
    } = parseDateTimeString(e.times[0]);
    return eventYear === year && eventMonth === month && eventDay === day;
  });

  const borderColorClass = getBorderColorClass(event);

  return `
    <div class="day-cell ${borderColorClass}">
      <div class="day-number">${day}</div>
      ${
        event
          ? `
        <div class="event">
          <div class="event-label">${event.label}</div>
          <div class="event-times">
            ${event.times.map((time, index) => `<span class="${borderColorClass}" key="${index}">${formatTime(time)}</span>`).join("")}
          </div>
        </div>`
          : ""
      }
    </div>
  `;
};

const getBorderColorClass = (event) => {
  if (!event) {
    return ""; // 이벤트가 없을 경우 빈 문자열 반환
  }

  switch (event.label) {
    case "근무":
      return EVENT_CLASSES.근무;
    case "지각":
      return EVENT_CLASSES.지각;
    case "조퇴":
      return EVENT_CLASSES.조퇴;
    default:
      return EVENT_CLASSES.근무; // 기본값
  }
};

// 버튼 이벤트 리스너 추가
const addEventListeners = (
  calendarHTML,
  currentDate,
  events,
  updateDashboard,
) => {
  calendarHTML
    .querySelector("#prev-button")
    .addEventListener("click", () =>
      changeMonth(-1, currentDate, events, updateDashboard),
    );

  calendarHTML
    .querySelector("#next-button")
    .addEventListener("click", () =>
      changeMonth(1, currentDate, events, updateDashboard),
    );
};

// 월 변경 함수
const changeMonth = (increment, currentDate, events, updateDashboard) => {
  currentDate.setMonth(currentDate.getMonth() + increment);
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.getMonth() + 1; // 0부터 시작하므로 1을 더함

  updateDashboard(selectedYear, selectedMonth);
  updateCalendar(currentDate, events, updateDashboard);
};

// 캘린더 업데이트
const updateCalendar = (currentDate, events, updateDashboard) => {
  const calendarContainer = document.querySelector("#calendar-container");
  calendarContainer.innerHTML = ""; // 기존 내용 초기화
  const newCalendarHTML = createCalendarHTML(currentDate, events);
  calendarContainer.appendChild(newCalendarHTML); // 새로운 캘린더 렌더링

  // 새로운 버튼 이벤트 리스너 추가
  addEventListeners(newCalendarHTML, currentDate, events, updateDashboard);
};
