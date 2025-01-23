import "./leaveDetail.css";
import { createButton } from "@/components/Button/button";

const leaveDetail = (container, id) => {  // id 매개변수 추가
  const leaveDetailRender = document.createElement("div");
  leaveDetailRender.className = "container-wrap";

  const editButton = createButton(
    "수정",
    () => {alert("수정 버튼을 클릭했습니다.")},
    ["btn--edit"]
  );
  const cancelButton = createButton(
    "취소",
    () => {window.location.href="/user/leave"},
    ["btn--delete"]
  );

  // 로컬 스토리지에서 해당 ID의 휴가 정보 가져오기
  const leaves = JSON.parse(localStorage.getItem("leaves"));
  const leaveItem = leaves.find(item => item.id === parseInt(id));  // urlParams.get('id') 대신 id 사용

  if (leaveItem) {
    leaveDetailRender.innerHTML = `
      <div class="header">
        <h1>휴가상세</h1>
        <div class="buttons">
          <!-- 버튼 삽입 영역 -->
        </div>
      </div>
      <div class="content-wrap">
        <div class="content-header">
          <span class="title">휴가정보</span>
        </div>
        <div class="content">
          <div class="row row1">
            <div class="data-wrap">
              <span class="label">시작일</span>
              <span class="value" id="start-date"></span>
            </div>
            <div class="data-wrap">
              <span class="label">종료일</span>
              <span class="value" id="end-date"></span>
            </div>
            <div class="data-wrap">
              <span class="label">휴가일수</span>
              <span class="value" id="leave-days"></span>
            </div>
          </div>
          <div class="row row2">
            <div class="data-wrap">
              <span class="label">휴가유형</span>
              <span class="value" id="leave-type"></span>
            </div>
            <div class="data-wrap">
              <span class="label">반차구분</span>
              <span class="value" id="halfday-type"></span>
            </div>
            <div class="data-wrap">
              <span class="label">사용여부</span>
              <span class="value" id="is-used"></span>
            </div>
          </div>
          <div class="row row3">
            <div class="data-wrap">
              <span class="label">사유</span>
              <span class="value large" id="reason"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(leaveDetailRender);

    // 버튼 추가
    const buttons = leaveDetailRender.querySelector('.buttons');
    buttons.appendChild(editButton);
    buttons.appendChild(cancelButton);

    // 데이터 채우기
    document.getElementById('start-date').textContent = leaveItem.startDate;
    document.getElementById('end-date').textContent = leaveItem.endDate;
    document.getElementById('leave-days').textContent = leaveItem.leaveDays;
    document.getElementById('leave-type').textContent = leaveItem.leaveType;
    document.getElementById('halfday-type').textContent = leaveItem.halfDayTypeId || '-';
    document.getElementById('is-used').textContent = leaveItem.isUsed ? "사용완료" : "사용안함";
    document.getElementById('reason').textContent = leaveItem.reason || '사유 없음';

  } else {
    leaveDetailRender.innerHTML = "<p>해당 휴가 정보를 찾을 수 없습니다.</p>";
    container.appendChild(leaveDetailRender);
  }
};

export default leaveDetail;