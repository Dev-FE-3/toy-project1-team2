import "./timer.css";
import { formatTime, isValidDate } from "../../utils/timeUtils.js";

export default function Timer({
  currentTime,
  workStart = null,
  workEnd = null,
}) {
  // 유효성 검증
  if (!isValidDate(currentTime)) {
    throw new Error("현재 시각의 날짜 형식이 유효하지 않습니다.");
  }
  if (workStart && !isValidDate(workStart)) {
    throw new Error("근무 시작의 날짜 형식이 유효하지 않습니다.");
  }
  if (workEnd && !isValidDate(workEnd)) {
    throw new Error("근무 종료의 날짜 형식이 유효하지 않습니다.");
  }

  // 현재 시각을 "시:분" 형식으로 변환
  const formattedCurrentTime = formatTime(currentTime);
  const formattedWorkStart = formatTime(workStart);
  const formattedWorkEnd = formatTime(workEnd);

  // 타이머 HTML 요소 생성
  const timerHTML = document.createElement("div");
  timerHTML.className = "timer-container";

  // 타이머 내용 설정
  timerHTML.innerHTML = `
      <div class="timer">
        <div class="timer__type-container">
          <div class="timer__type">
            <div>현재 시각</div>
            <div id="current-time">${formattedCurrentTime}</div>
          </div>
          <div class="timer__type">
            <div>근무 시작</div>
            <div id="workStart-time">${workStart ? formattedWorkStart : "-"}</div>
          </div>
          <div class="timer__type">
            <div>근무 종료</div>
            <div id="workEnd-time">${workEnd ? formattedWorkEnd : "-"}</div>
          </div>
        </div>
        <div class="timer__status-container">
          <span id="toggle-status" class="status--before">근무전</span>
          <div class="toggle-container">
            <label class="toggle">
              <input id="toggle-checkbox" type="checkbox" />
              <div class="slider" />
            </label>
          </div>
        </div>
      </div>
      `;

  const checkbox = timerHTML.querySelector("#toggle-checkbox");
  const statusText = timerHTML.querySelector("#toggle-status");
  const currentTimeElement = timerHTML.querySelector("#current-time");
  const workStartElement = timerHTML.querySelector("#workStart-time");
  const workEndElement = timerHTML.querySelector("#workEnd-time");

  // 상태 업데이트 함수
  const updateStatus = (newStatus) => {
    let statusClass;

    switch (newStatus) {
      case "근무중":
        statusClass = "during";
        break;
      case "근무종료":
        statusClass = "end";
        break;
      default:
        statusClass = "before";
        break;
    }

    statusText.className = `status--${statusClass}`;
    statusText.textContent = newStatus;
  };

  const handleToggle = () => {
    const isChecked = checkbox.checked;

    // 근무 종료 조건 체크
    if (isChecked) {
      if (!workStart) {
        workStart = currentTime;
        workStartElement.textContent = formatTime(workStart);
        updateStatus("근무중");
      }
    } else {
      // 체크박스가 체크 해제될 때, 즉 근무 종료 처리
      if (workStart) {
        // 이미 근무 중일 경우, 근무 종료 처리
        workEnd = currentTime;
        workEndElement.textContent = formatTime(workEnd);
        updateStatus("근무종료");
        checkbox.disabled = true;
      } else {
        updateStatus("근무전"); // 근무 전 상태
      }
    }
  };

  // 현재 시각을 업데이트하는 함수
  const updateCurrentTime = (newTime) => {
    currentTimeElement.textContent = formatTime(newTime);
  };

  // 이벤트 리스너 추가
  checkbox.addEventListener("change", handleToggle);

  return {
    element: timerHTML,
    updateCurrentTime, // 업데이트 함수 반환
  };
}
