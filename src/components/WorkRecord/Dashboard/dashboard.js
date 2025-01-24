import "./dashboard.css";
import { fetchFromLocalStorage } from "@/utils/storageUtils";
import { WORK_RECORD_KEY } from "@/constants/constants";
import { parseDateTimeString } from "@/utils/timeUtils";

// 상수 정의
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DEFAULT_TOTAL_DAYS = 20; // 기본 총 일수

// 상태 레이블 상수
const LABELS = {
  WORKED: "근무",
  NOT_WORKED: "미근무",
  LATE: "지각",
  LEAVE: "조퇴",
};

export function Dashboard(year, month) {
  const events = fetchFromLocalStorage(WORK_RECORD_KEY);

  const workRecord = {
    totalDays: DEFAULT_TOTAL_DAYS,
    worked: 0,
    notWorked: 0,
    late: 0,
    leave: 0,
  };

  // 통계 업데이트
  updateWorkRecord(events, year, month, workRecord);

  // 총 작업 수 계산
  const { totalDays, worked, notWorked, late, leave } = workRecord;
  const totalWorkedDays = worked + notWorked + late + leave;
  const percentage = calculatePercentage(totalDays, totalWorkedDays);

  const dashboardHTML = createDashboardHTML(percentage, workRecord);

  const progressCircle = dashboardHTML.querySelector("#progressCircle");
  const percentageText = dashboardHTML.querySelector("#percentageText");
  const progressInput = dashboardHTML.querySelector("#progressInput");

  // 초기화: 원형 프로그래스 바의 길이를 전체 길이로 설정
  initializeProgressBar(progressCircle, percentageText, percentage);

  // 슬라이더 이벤트 리스너
  progressInput.addEventListener("input", (event) => {
    const value = event.target.value;
    updateProgress(progressCircle, percentageText, value);
  });

  return dashboardHTML;
}

const updateWorkRecord = (events, year, month, workRecord) => {
  events.forEach((e) => {
    const { year: eventYear, month: eventMonth } = parseDateTimeString(
      e.times[0]
    );
    if (eventYear === year && eventMonth === month) {
      switch (e.label) {
        case LABELS.WORKED:
          workRecord.worked += 1;
          break;
        case LABELS.NOT_WORKED:
          workRecord.notWorked += 1;
          break;
        case LABELS.LATE:
          workRecord.late += 1;
          break;
        case LABELS.LEAVE:
          workRecord.leave += 1;
          break;
      }
    }
  });
};

// 대시보드 HTML 생성 함수
const createDashboardHTML = (percentage, workRecord) => {
  const dashboardHTML = document.createElement("div");
  dashboardHTML.id = "dashboard-container";

  dashboardHTML.innerHTML = `
  <div class="dashboard">
    <div class="circle">
        <svg class="progress-circle" width="102" height="102" viewBox="0 0 200 200">
            <circle class="background" cx="100" cy="100" r="${RADIUS}"></circle>
            <circle class="progress" cx="100" cy="100" r="${RADIUS}" id="progressCircle"></circle>
        </svg>
        <div class="percentage" id="percentageText">${percentage.toFixed(0)}%</div>
    </div>
    <input type="range" class="hidden" id="progressInput" min="0" max="100" value="${percentage.toFixed(0)}">
    <div class="stats-container">
        <div class="stat-card">
            <p class="stat-label">소정일수</p>
            <p class="stat-value">${workRecord.totalDays}</p>
        </div>
        <div class="stat-card">
            <p class="stat-label">근무</p>
            <p class="stat-value">${workRecord.worked}</p>
        </div>
        <div class="stat-card">
            <p class="stat-label">미근무</p>
            <p class="stat-value">${workRecord.notWorked}</p>
        </div>
        <div class="stat-card">
            <p class="stat-label">지각</p>
            <p class="stat-value">${workRecord.late}</p>
        </div>
        <div class="stat-card">
            <p class="stat-label">조퇴</p>
            <p class="stat-value">${workRecord.leave}</p>
        </div>
    </div>
  </div>`;

  return dashboardHTML;
};

// 전체 일수에 대한 퍼센트 계산
const calculatePercentage = (totalDaysCount, checkedDays) => {
  return totalDaysCount > 0 ? (checkedDays / totalDaysCount) * 100 : 0;
};

// 프로그래스 바 초기화를 담당하는 함수 추가
const initializeProgressBar = (progressCircle, percentageText, percentage) => {
  progressCircle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
  updateProgress(progressCircle, percentageText, percentage);
};

// 프로그래스 바와 텍스트를 업데이트하는 함수 추가
const updateProgress = (progressCircle, percentageText, value) => {
  const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;
  progressCircle.style.strokeDashoffset = offset;
  percentageText.textContent = `${parseFloat(value).toFixed(0)}%`;
};
