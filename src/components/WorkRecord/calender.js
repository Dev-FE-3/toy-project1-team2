import "./calender.css";

let currentDate = new Date(); // 현재 날짜 상태

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const events = [
  {
    id: 1,
    date: 1,
    label: "근무",
    times: ["14:00", "17:00"],
  },
  {
    id: 2,
    date: 3,
    label: "지각",
    times: ["14:00", "17:00"],
  },
  {
    id: 3,
    date: 17,
    label: "조퇴",
    times: ["14:00", "17:00"],
  },
  {
    id: 4,
    date: 18,
    label: "조퇴",
    times: ["14:00", "17:00"],
  },
];

export default function Calender() {
  // 캘린더 HTML 요소 생성
  const calenderHTML = document.createElement("div");
  calenderHTML.className = "modal-container";

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const emptyCells = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  console.log(daysInMonth, emptyCells, days);

  // 테두리 색상을 결정하는 함수
  const getBorderColorClass = (event) => {
    if (!event) return "";
    let eventColor;

    switch (event.label) {
      case "근무":
        eventColor = "normal";
        break;
      case "지각":
        eventColor = "late";
        break;
      case "조퇴":
        eventColor = "leave";
        break;
      default:
        eventColor = "normal";
    }

    return `event--${eventColor}`;
  };

  calenderHTML.innerHTML = `
  <div class="calendar-container">
    <div class="calendar">

      <!-- Calendar Header -->
      <div class="calendar-header">
        <button class="calendar-button" aria-label="이전달" id="prev-button">
            <span class="material-icons">keyboard_arrow_left</span>
        </button>
        <h2 class="calendar-title">${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월</h2>
         <button class="calendar-button" aria-label="다음달" id="next-button">
            <span class="material-icons">keyboard_arrow_right</span>
        </button>
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        ${weekDays.map((day) => `<div class="weekday-header">${day}</div>`).join("")}
        ${Array.from({ length: emptyCells })
          .map(
            (_, index) => `<div key="empty-${index}" class="day-cell"></div>`
          )
          .join("")}
        ${days
          .map((day, index) => {
            const event = events.find((e) => e.date === day);
            const borderColorClass = getBorderColorClass(event);
            return `
            <div class="day-cell ${borderColorClass}">
              <div key="${index}" class="day-number">${day}</div>
              ${
                event
                  ? `
                <div class="event">
                  <div class="event-label">${event.label}</div>
                  <div class="event-times">
                    ${event.times.map((time, index) => `<span class="${borderColorClass}" key="${index}">${time}</span>`).join("")}
                  </div>
                </div>
              `
                  : ""
              }
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  </div>
  `;

  const prevButtonElement = calenderHTML.querySelector("#prev-button");
  const nextButtonElement = calenderHTML.querySelector("#next-button");

  prevButtonElement.addEventListener("click", goToPreviousMonth);
  nextButtonElement.addEventListener("click", goToNextMonth);

  return calenderHTML;
}

// 이전 달로 이동
function goToPreviousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
}

// 다음 달로 이동
function goToNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
}

// 캘린더 업데이트
function updateCalendar() {
  const calendarContainer = document.querySelector(".modal-container");
  calendarContainer.innerHTML = ""; // 기존 내용 초기화
  calendarContainer.appendChild(Calender()); // 새로운 캘린더 렌더링
}
