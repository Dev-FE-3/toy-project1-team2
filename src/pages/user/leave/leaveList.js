import "./leaveList.css";

import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/input";
import { createDropdown } from "@/components/Dropdown/dropdown";

// 휴가 데이터 로컬스토리지에서 불러오기
const leaves = JSON.parse(localStorage.getItem("leaves"));

const leaveList = (container) => {
  // 휴가 목록 기본 레이아웃
  const leaveListRender = document.createElement("div");
  leaveListRender.className = "container-wrap";

  const submitButton = createButton(
    "신청",
    () => {window.location.href="javascript:void(0)"},
    ["btn--submit"]
  );
  const deleteButton = createButton(
    "삭제",
    () => {alert("삭제 버튼 클릭")},
    ["btn--delete"]
  );

  // 드롭다운 생성
  const options = ["전체", "연차", "반차"];
  const dropdown = createDropdown({
    placeholder: "선택",
    options,
  })

  // 전체 선택 체크박스 생성
  const checkAllInput = createInputField({
    type: "checkbox",
    attributes: { name: "checkAll", classList: ["select-all"] },
  });

  leaveListRender.innerHTML = `
    <div class="header">
      <h1>휴가목록</h1>
      <div class="buttons">
        <!-- 버튼 삽입 영역 -->
      </div>
    </div>
    <div class="content-wrap">
      <div class="content-top">
        <div class="filter">
          <!-- 드롭다운 삽입 영역 -->
        </div>
      </div>
      <table>
        <thead>
          <th>번호</th>
          <th>휴가신청일</th>
          <th>휴가시작일</th>
          <th>휴가종료일</th>
          <th>휴가유형</th>
          <th>반차구분</th>
          <th>휴가일수</th>
          <th>사용여부</th>
          <th class="select-all-wrap"></th>
        </thead>
        <tbody>
          <!-- 데이터 불러올 영역 -->
        </tbody>
      </table>
    </div>
  `;

  container.appendChild(leaveListRender); // 화면에 렌더링
  document.querySelector(".buttons").appendChild(submitButton);
  document.querySelector(".buttons").appendChild(deleteButton);
  document.querySelector(".filter").appendChild(dropdown);
  document.querySelector(".select-all-wrap").appendChild(checkAllInput);
}

export default leaveList; 