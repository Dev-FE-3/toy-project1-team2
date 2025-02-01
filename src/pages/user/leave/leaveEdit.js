import "./leaveCommon.css";
import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/input";
import Modal from "@/components/Modal/modal";

const leaveEdit = (container, id) => {
  const leaveEditRender = document.createElement("div");
  leaveEditRender.className = "wrapper";

  // URL에서 leave ID를 가져오는 함수
  const leaveId = window.location.pathname.split("/")[2];

  // 모달 표시 함수
  const showModal = (message) => {
    const modal = Modal({
      title: "알림",
      message,
      modalStyle: "warning",
      showCancelBtn: true,
    });

    document.body.appendChild(modal.modalHTML);
    modal.openModal(); // 모달 열기
  };

  const editButton = createButton({
    text: "수정",
    classNames: ["btn--edit"],
    onClick: () => {
      const startDateInput = document.getElementById("start-date");
      const endDateInput = document.getElementById("end-date");
      const leaveTypeSelect = document.getElementById("leave-type");
      const halfdayTypeSelect = document.getElementById("halfday-type");
      const reasonInput = document.getElementById("reason");

      // 필수 입력 필드 검증
      if (
        !startDateInput.value ||
        !endDateInput.value ||
        !leaveTypeSelect.value
      ) {
        showModal("필수 입력 항목을 모두 입력해주세요.");
        return;
      }

      // 반차 선택 시 반차 구분 필수
      if (leaveTypeSelect.value === "반차" && halfdayTypeSelect.value === "-") {
        showModal("반차 구분을 선택해주세요.");
        return;
      }

      // 모달 생성
      const modal = Modal({
        title: "휴가 수정",
        message: "휴가 수정이 완료되었습니다.",
        modalStyle: "success",
        showCancelBtn: false,
        onConfirm: () => {
          // 데이터 업데이트
          const updatedLeave = {
            id: parseInt(id), // 기존 ID는 그대로 유지
            startDate: formatDate(startDateInput.value), // 날짜 포맷 적용
            endDate: formatDate(endDateInput.value), // 날짜 포맷 적용
            leaveType: leaveTypeSelect.value,
            halfDayTypeId: halfdayTypeSelect.value,
            reason: reasonInput.value,
            leaveDays: calculateBusinessDays(
              startDateInput.value,
              endDateInput.value
            ),
            isUsed: false, // 수정 페이지에서는 기본값으로 설정
            applicationDate: formatDate(new Date().toISOString().split("T")[0]), // 신청일도 포맷 적용
          };

          // 로컬스토리지 업데이트
          const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
          const index = leaves.findIndex((leave) => leave.id === parseInt(id));
          if (index !== -1) {
            leaves[index] = updatedLeave;
            localStorage.setItem("leaves", JSON.stringify(leaves));
            window.location.href = `/user/leave/${id}`; // 수정된 페이지로 리다이렉트
          } else {
            showModal("휴가 정보를 찾을 수 없습니다.");
          }
        },
      });

      document.body.appendChild(modal.modalHTML);
      modal.openModal();
    }
  });

  const cancelButton = createButton({
    text: "취소",
    classNames: ["btn--delete"],
    onClick: () => {
      window.location.href = `/user/leave/${id}`;
    }
  });

  leaveEditRender.innerHTML = `
  <div class="header">
    <h1 class="header__title">휴가 수정</h1>
    <div class="buttons">
      <!-- 버튼 삽입 영역 -->
    </div>
  </div>
  <div class="wrapper leave-edit">
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
          <span class="value input-box" id="is-used">사용안함</span>
        </div>
      </div>
      <div class="row row3">
        <div class="data-wrap" id="reason-wrap"></div>
      </div>
    </div>
  </div>
`;

  container.appendChild(leaveEditRender);

  // 버튼 추가
  const buttons = leaveEditRender.querySelector(".buttons");
  buttons.appendChild(editButton);
  buttons.appendChild(cancelButton);

  // 입력 필드 추가
  document.getElementById("start-date-wrap").appendChild(
    createInputField({
      type: "date",
      label: { name: "시작일", forAttr: "start-date" },
      attributes: { id: "start-date", name: "start-date" },
    })
  );

  document.getElementById("end-date-wrap").appendChild(
    createInputField({
      type: "date",
      label: { name: "종료일", forAttr: "end-date" },
      attributes: { id: "end-date", name: "end-date" },
    })
  );

  document.getElementById("leave-type-wrap").appendChild(
    createInputField({
      tagName: "select",
      label: { name: "휴가유형", forAttr: "leave-type" },
      attributes: { id: "leave-type", name: "leave-type" },
    })
  );

  document.getElementById("halfday-type-wrap").appendChild(
    createInputField({
      tagName: "select",
      label: { name: "반차구분", forAttr: "halfday-type" },
      attributes: { id: "halfday-type", name: "halfday-type" },
    })
  );

  document.getElementById("reason-wrap").appendChild(
    createInputField({
      tagName: "textarea",
      label: { name: "사유", forAttr: "reason" },
      attributes: { id: "reason", name: "reason", classList: ["large"] },
    })
  );

  // 반차 구분 옵션 추가
  const halfDayTypeSelect = document.getElementById("halfday-type");

  // 기본 옵션 '-' 추가
  const defaultOption = document.createElement("option");
  defaultOption.value = "-";
  defaultOption.textContent = "-";
  halfDayTypeSelect.appendChild(defaultOption);

  // 휴가 유형에 따른 반차 구분 동적 변경
  const leaveTypeSelect = document.getElementById("leave-type");
  ["연차", "반차"].forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    leaveTypeSelect.appendChild(option);
  });
  leaveTypeSelect.addEventListener("change", (e) => {
    const selectedType = e.target.value;
    const startDateValue = startDateEl.value;
    const endDateValue = endDateEl.value;

    if (selectedType === "반차") {
      // 시작일과 종료일이 다를 경우 반차 선택 불가
      if (startDateValue && endDateValue && startDateValue !== endDateValue) {
        showModal("반차는 시작일과 종료일이 같아야 선택 가능합니다.");
        leaveTypeSelect.value = ""; // 선택 초기화
        return;
      }

      // 반차 선택 시 옵션 변경 및 휴가 일수 고정
      halfDayTypeSelect.innerHTML = ""; // 기존 옵션 초기화
      ["오전", "오후"].forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        halfDayTypeSelect.appendChild(option);
      });

      // 휴가 일수 0.5로 고정
      document.getElementById("leave-days").textContent = "0.5";

      // 필수 입력 필드로 설정
      halfDayTypeSelect.setAttribute("required", "true");
      halfDayTypeSelect
        .closest(".input-group")
        .querySelector("label").innerHTML += ' <span class="required">*</span>';
    } else {
      // 연차 선택 시 기본 옵션으로 복원
      halfDayTypeSelect.innerHTML = ""; // 기존 옵션 초기화
      halfDayTypeSelect.appendChild(defaultOption); // 기본 옵션 추가

      // 휴가 일수 계산
      if (startDateValue && endDateValue) {
        const businessDays = calculateBusinessDays(
          startDateValue,
          endDateValue
        );
        document.getElementById("leave-days").textContent = businessDays;
      }

      // 필수값 해제
      halfDayTypeSelect.removeAttribute("required");
      const requiredSpan = halfDayTypeSelect
        .closest(".input-group")
        .querySelector(".required");
      if (requiredSpan) requiredSpan.remove();
    }
  });

  // 주말 및 공휴일 체크 함수
  function isWeekendOrHoliday(date) {
    const day = date.getDay();
    const dateString = date.toISOString().split("T")[0];

    const holidays2025 = [
      "2025-01-01",
      "2025-01-27",
      "2025-01-28",
      "2025-01-29",
      "2025-01-30",
      "2025-03-01",
      "2025-05-05",
      "2025-06-06",
      "2025-08-15",
      "2025-10-03",
      "2025-10-09",
      "2025-12-25",
    ];

    return day === 0 || day === 6 || holidays2025.includes(dateString);
  }

  // 휴가 일수 계산 함수
  function calculateBusinessDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let businessDays = 0;

    while (start <= end) {
      if (!isWeekendOrHoliday(start)) {
        businessDays++;
      }
      start.setDate(start.getDate() + 1);
    }

    return businessDays;
  }

  // 날짜 이벤트 리스너 추가
  const startDateEl = document.getElementById("start-date");
  const endDateEl = document.getElementById("end-date");

  startDateEl.addEventListener("change", (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();

    // 과거 날짜 선택 방지
    if (selectedDate < today) {
      e.target.value = "";
      showModal("과거의 날짜는 선택할 수 없습니다.");
      return;
    }

    // 주말 및 공휴일 선택 방지
    if (isWeekendOrHoliday(selectedDate)) {
      e.target.value = "";
      showModal("주말 및 공휴일은 선택할 수 없습니다.");
      return;
    }

    // 종료일이 이미 선택된 경우 휴가일수 재계산
    if (endDateEl.value) {
      const businessDays = calculateBusinessDays(
        e.target.value,
        endDateEl.value
      );
      document.getElementById("leave-days").textContent = businessDays;
    }
  });

  endDateEl.addEventListener("change", (e) => {
    const selectedDate = new Date(e.target.value);

    // 과거 날짜 선택 방지
    if (selectedDate < new Date()) {
      e.target.value = "";
      showModal("과거의 날짜는 선택할 수 없습니다.");
      return;
    }

    // 시작일보다 이전 날짜 선택 방지
    if (selectedDate < new Date(startDateEl.value)) {
      e.target.value = "";
      showModal("시작일 이후의 날짜를 선택해주세요.");
      return;
    }

    // 주말 및 공휴일 선택 방지
    if (isWeekendOrHoliday(selectedDate)) {
      e.target.value = "";
      showModal("주말 및 공휴일은 선택할 수 없습니다.");
      return;
    }

    // 휴가일수 계산
    const businessDays = calculateBusinessDays(
      startDateEl.value,
      e.target.value
    );
    document.getElementById("leave-days").textContent = businessDays;
  });

  // 날짜 포맷 함수 추가
  function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }

  // 로컬 스토리지에서 데이터 가져오기
  const leaves = JSON.parse(localStorage.getItem("leaves"));
  const leaveItem = leaves.find((leave) => leave.id === parseInt(id));

  if (leaveItem) {
    document.getElementById("start-date").value = leaveItem.startDate;
    document.getElementById("end-date").value = leaveItem.endDate;
    document.getElementById("leave-type").value = leaveItem.leaveType;
    document.getElementById("halfday-type").value =
      leaveItem.halfDayTypeId || "-";
    document.getElementById("reason").value = leaveItem.reason || "";
    document.getElementById("leave-days").textContent = leaveItem.leaveDays;
  } else {
    showModal("해당 휴가 정보를 찾을 수 없습니다.");
  }
};

export default leaveEdit;
