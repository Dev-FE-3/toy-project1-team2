import "./timer.css";
import Modal from "@/components/Modal/modal.js";
import { formatTime, isValidDate } from "@/utils/timeUtils.js";

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
    const statusClass = {
      근무중: "during",
      근무종료: "end",
      근무전: "before",
    }[newStatus];

    statusText.className = `status--${statusClass}`;
    statusText.textContent = newStatus;
  };

  // 근무 시작 모달
  const showStartWorkModal = () => {
    const modal = Modal({
      title: "안내",
      message: "근무를 시작하시겠습니까?",
      modalStyle: "primary",
      onConfirm: () => {
        workStart = currentTime;
        workStartElement.textContent = formatTime(workStart);
        updateStatus("근무중");
        checkbox.checked = true;
      },
      showCancelBtn: true,
    });

    document.body.appendChild(modal.modalHTML);
    modal.openModal(); // 모달 열기
  };

  // 근무 종료 모달
  const showEndWorkModal = () => {
    const modal = Modal({
      title: "안내",
      message: "근무를 종료하시겠습니까?",
      modalStyle: "primary",
      onConfirm: () => {
        workEnd = currentTime;
        workEndElement.textContent = formatTime(workEnd);
        updateStatus("근무종료");
        checkbox.checked = false;
        checkbox.disabled = true;
      },
      showCancelBtn: true,
    });

    document.body.appendChild(modal.modalHTML);
    modal.openModal(); // 모달 열기
  };

  // 토글 컨트롤러
  const handleToggle = () => {
    const isChecked = checkbox.checked;

    // 근무 종료 조건 체크
    if (isChecked) {
      if (!workStart) {
        checkbox.checked = false;
        showStartWorkModal();
      }
    } else {
      checkbox.checked = true;
      showEndWorkModal();
    }
  };

  // 현재 시각을 업데이트하는 함수
  const updateCurrentTime = (newTime) => {
    currentTimeElement.textContent = formatTime(newTime);
  };

  // 이벤트 리스너 추가
  checkbox.addEventListener("change", handleToggle);

  return {
    timerHTML,
    updateCurrentTime,
  };
}
