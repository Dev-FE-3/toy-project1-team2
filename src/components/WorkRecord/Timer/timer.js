import "./timer.css";
import Modal from "@/components/Modal/modal.js";
import { formatTime, formatDate, isValidDate } from "@/utils/timeUtils.js";
import { addToLocalStorage, generateUUID } from "@/utils/storageUtils";
import { WORK_RECORD_KEY } from "@/constants/constants.js";

// 로컬 스토리지에 이벤트 추가
const saveEventToLocalStorage = (event) => {
  addToLocalStorage(WORK_RECORD_KEY, event);
};

// 모달 표시 함수
const showModal = (title, style, message, onConfirm) => {
  const modal = Modal({
    title,
    message,
    modalStyle: style,
    onConfirm,
    showCancelBtn: true,
  });

  document.body.appendChild(modal.modalHTML);
  modal.openModal(); // 모달 열기
};

export function Timer({
  currentTime,
  workStart = null,
  workEnd = null,
  onEndWork,
}) {
  // 근무 이벤트 객체
  const workEvent = {
    id: generateUUID(),
    label: "근무",
    times: ["", ""],
  };

  // 현재 시각을 "시:분" 형식으로 변환
  const formattedCurrentTime = formatTime(currentTime);
  const formattedWorkStart = formatTime(workStart);
  const formattedWorkEnd = formatTime(workEnd);

  const timerHTML = createTimerHTML(
    formattedCurrentTime,
    formattedWorkStart,
    formattedWorkEnd
  );

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

  const updateWorkStart = (time) => {
    workStart = time;
    workStartElement.textContent = formatTime(workStart);
    updateStatus("근무중");
    checkbox.checked = true;

    // 로컬 스토리지에 이벤트 추가
    workEvent.times[0] = formatDate(workStart);
  };

  // 근무 종료 모달
  const showEndWorkModal = () => {
    showModal("안내", "warning", "근무를 종료하시겠습니까?", () => {
      workEnd = currentTime;
      workEndElement.textContent = formatTime(workEnd);
      updateStatus("근무종료");
      checkbox.checked = false;
      checkbox.disabled = true;

      // 종료 시간 업데이트
      workEvent.times[1] = formatDate(workEnd);
      saveEventToLocalStorage(workEvent);

      // 캘린더 리렌더링 호출
      if (onEndWork) {
        onEndWork(); // 추가된 부분: 캘린더 리렌더링
      }
    });
  };

  // 토글 컨트롤러
  const handleToggle = () => {
    const isChecked = checkbox.checked;

    // 근무 종료 조건 체크
    if (isChecked) {
      if (!workStart) {
        checkbox.checked = false;
        showModal("안내", "primary", "근무를 시작하시겠습니까?", () => {
          updateWorkStart(currentTime);
        });
      }
    } else {
      checkbox.checked = true;
      showEndWorkModal();
    }
  };

  // 현재 시각을 업데이트하는 함수
  const updateCurrentTime = (newTime) => {
    currentTime = newTime;
    currentTimeElement.textContent = formatTime(newTime);
  };

  // 타이머 시작 메소드
  const startTimer = () => {
    const intervalId = setInterval(() => {
      currentTime = new Date(); // 현재 시각 업데이트
      updateCurrentTime(currentTime);
    }, 1000);

    return () => clearInterval(intervalId);
  };

  // 이벤트 리스너 추가
  checkbox.addEventListener("change", handleToggle);

  // 타이머 시작
  const clearTimer = startTimer();

  return { element: timerHTML, clearTimer };
}

const createTimerHTML = (
  formattedCurrentTime,
  formattedWorkStart,
  formattedWorkEnd
) => {
  // 타이머 HTML 요소 생성
  const timerHTML = document.createElement("div");
  timerHTML.id = "timer-container";

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
            <div id="workStart-time">${formattedWorkStart}</div>
          </div>
          <div class="timer__type">
            <div>근무 종료</div>
            <div id="workEnd-time">${formattedWorkEnd}</div>
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

  return timerHTML;
};
