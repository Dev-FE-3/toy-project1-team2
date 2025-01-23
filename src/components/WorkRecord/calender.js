import "./calender.css";
import { fetchFromLocalStorage } from "@/utils/storageUtils";
import { formatTime, parseDateTimeString } from "@/utils/timeUtils";
import { WORK_RECORD_KEY } from "@/constants/constants";

export default function Calender() {
  const weekName = ["일", "월", "화", "수", "목", "금", "토"];
  let currentDate = new Date(); // 현재 날짜 상태

  const events = fetchFromLocalStorage(WORK_RECORD_KEY);

  // 캘린더 생성
  const createCalendarHTML = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const daysInMonth = new Date(
      currentYear,
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const emptyCells = new Date(
      currentYear,
      currentDate.getMonth(),
      1
    ).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const calenderHTML = document.createElement("div");

    calenderHTML.id = "calendar-container";
    calenderHTML.innerHTML = `
        <div class="calendar">
          <div class="calendar-header">
            <button class="calendar-button" aria-label="이전달" id="prev-button">
              <span class="material-icons">keyboard_arrow_left</span>
            </button>
            <h2 class="calendar-title">${currentYear}년 ${currentMonth}월</h2>
            <button class="calendar-button" aria-label="다음달" id="next-button">
              <span class="material-icons">keyboard_arrow_right</span>
            </button>
          </div>
          <div class="calendar-grid">
            ${weekName.map((name) => `<div class="weekday-header">${name}</div>`).join("")}
            ${Array.from({ length: emptyCells })
              .map(
                (_, index) =>
                  `<div key="empty-${index}" class="day-cell"></div>`
              )
              .join("")}
            ${days.map((day) => renderEvents(day, currentYear, currentMonth)).join("")}
          </div>
        </div>
    `;

    // 버튼 이벤트 리스너 추가
    calenderHTML
      .querySelector("#prev-button")
      .addEventListener("click", () => changeMonth(-1));
    calenderHTML
      .querySelector("#next-button")
      .addEventListener("click", () => changeMonth(1));

    return calenderHTML;
  };

  // 이벤트 렌더링 함수
  const renderEvents = (day, year, month) => {
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

  // 테두리 색상을 결정하는 함수
  const getBorderColorClass = (event) => {
    if (!event) return "";
    switch (event.label) {
      case "근무":
        return "event--normal";
      case "지각":
        return "event--late";
      case "조퇴":
        return "event--leave";
      default:
        return "event--normal";
    }
  };

  // 월 변경 함수
  const changeMonth = (increment) => {
    currentDate.setMonth(currentDate.getMonth() + increment);
    updateCalendar();
  };

  // 캘린더 업데이트
  const updateCalendar = () => {
    const calendarContainer = document.querySelector(".calendar-container");
    calendarContainer.innerHTML = ""; // 기존 내용 초기화
    calendarContainer.appendChild(createCalendarHTML()); // 새로운 캘린더 렌더링
  };

  return createCalendarHTML();
}
