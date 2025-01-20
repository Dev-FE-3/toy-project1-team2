import "./timer.css";

export default function Timer({ currentTime, workStart, workEnd }) {
  // 유효한 날짜 형식인지 확인하는 함수
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // 유효한 날짜인지 확인
  };

  // 유효성 검증
  if (
    !isValidDate(currentTime) ||
    !isValidDate(workStart) ||
    !isValidDate(workEnd)
  ) {
    throw new Error(
      "(현재 시각, 근무 시작, 근무 종료)의 날짜 형식이 유효하지 않습니다."
    );
  }

  // 타이머 HTML 요소 생성
  const timerHTML = document.createElement("div");
  timerHTML.className = "timer-container";

  // 타이머 내용 설정
  timerHTML.innerHTML = `
      <div class="timer">
        <div class="timer__type-container">
          <div class="timer__type">
            <div>현재 시각</div>
            <div>${currentTime}</div>
          </div>
          <div class="timer__type">
            <div>근무 시작</div>
            <div>${workStart}</div>
          </div>
          <div class="timer__type">
            <div>근무 종료</div>
            <div>${workEnd}</div>
          </div>
        </div>
        <div class="timer__status-container">
          <span id="toggle-status" class="toggle-status">근무전</span>
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

  // 토글 핸들러 정의
  const handleToggle = () => {
    let newStatus = checkbox.checked ? "근무중" : "근무전";

    const workEndTime = new Date(workEnd).getTime();
    const currentTimeStamp = new Date(currentTime).getTime();

    if (currentTimeStamp >= workEndTime) {
      newStatus = "근무종료";
    }

    statusText.textContent = newStatus; // 최종 상태 텍스트 업데이트
  };

  // 이벤트 리스너 추가
  checkbox.addEventListener("change", handleToggle);

  return timerHTML;
}
