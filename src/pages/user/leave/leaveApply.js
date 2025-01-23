import "./leaveApply.css";
import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/Input";
import Modal from "@/components/Modal/modal";

const leaveApply = (container) => {
  const leaveApplyRender = document.createElement("div");
  leaveApplyRender.className = "container-wrap";

  const submitButton = createButton(
    "신청",
    () => {alert("신청 버튼을 클릭했습니다.")},
    ["btn--submit"]
  );
  const cancelButton = createButton(
    "취소",
    () => {window.location.href = "/leave"},
    ["btn--delete"]
  );

  leaveApplyRender.innerHTML = `
  <div class="header">
    <h1>휴가신청</h1>
    <div class="buttons">
      <!-- 버튼 삽입 영역 -->
    </div>
  </div>
  <div class="content-wrap leave-apply">
    <div class="content-header">
      <span class="title">휴가정보</span>
    </div>
    <div class="content">
      <div class="row row1">
        <div class="data-wrap" id="start-date-wrap"></div>
        <div class="data-wrap" id="end-date-wrap"></div>
        <div class="data-wrap">
          <span>휴가일수</span>
          <span class="value input-box" id="leave-days"></span>
        </div>
      </div>
      <div class="row row2">
        <div class="data-wrap" id="leave-type-wrap"></div>
        <div class="data-wrap" id="halfday-type-wrap"></div>
        <div class="data-wrap">
          <span>사용여부</span>
          <span class="value input-box" id="is-used">사용완료</span>
        </div>
      </div>
      <div class="row row3">
        <div class="data-wrap" id="reason-wrap"></div>
      </div>
    </div>
  </div>
`;

container.appendChild(leaveApplyRender);

// 버튼 추가
const buttons = leaveApplyRender.querySelector('.buttons');
buttons.appendChild(submitButton);
buttons.appendChild(cancelButton);

// 입력 필드 추가
document.getElementById('start-date-wrap').appendChild(createInputField({
  type: "date",
  label: { name: "시작일", forAttr: "start-date" },
  attributes: { id: "start-date", name: "start-date" },
  datasets: { required: true }
}));

document.getElementById('end-date-wrap').appendChild(createInputField({
  type: "date",
  label: { name: "종료일", forAttr: "end-date" },
  attributes: { id: "end-date", name: "end-date" },
  datasets: { required: true }
}));

document.getElementById('leave-type-wrap').appendChild(createInputField({
  tagName: "select",
  label: { name: "휴가유형", forAttr: "leave-type" },
  attributes: { id: "leave-type", name: "leave-type" },
  datasets: { required: true }
}));

document.getElementById('halfday-type-wrap').appendChild(createInputField({
  tagName: "select",
  label: { name: "반차구분", forAttr: "halfday-type" },
  attributes: { id: "halfday-type", name: "halfday-type" }
}));

document.getElementById('reason-wrap').appendChild(createInputField({
  tagName: "textarea",
  label: { name: "사유", forAttr: "reason" },
  attributes: { id: "reason", name: "reason", classList: ["large"] },
  datasets: { required: false }
}));

// 휴가 유형 옵션 추가
const leaveTypeSelect = document.getElementById('leave-type');
['연차', '반차'].forEach(type => {
  const option = document.createElement('option');
  option.value = type;
  option.textContent = type;
  leaveTypeSelect.appendChild(option);
});

// 반차 구분 옵션 추가
const halfDayTypeSelect = document.getElementById('halfday-type');
['오전', '오후'].forEach(type => {
  const option = document.createElement('option');
  option.value = type;
  option.textContent = type;
  halfDayTypeSelect.appendChild(option);
});
};

// 다음 ID 가져오기
function getNextId() {
const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
const maxId = leaves.reduce((max, leave) => Math.max(max, leave.id), 50);
return maxId + 1;
}

// 휴가 일수 계산 (간단한 예시)
function calculateLeaveDays(startDate, endDate) {
const start = new Date(startDate);
const end = new Date(endDate);
const diffTime = Math.abs(end - start);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
return diffDays;
}

// 새로운 휴가 저장
function saveLeave(newLeave) {
const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
leaves.push(newLeave);
localStorage.setItem("leaves", JSON.stringify(leaves));
}

export default leaveApply