import "./modal.css";

// 기본 스타일 타입 정의
const validModalStyles = ["primary", "success", "warning"];

export default function Modal({
  title,
  message,
  modalStyle = "primary",
  onConfirm,
  showCancelBtn = true,
}) {
  // 모달 스타일 유효성 검사
  if (!validModalStyles.includes(modalStyle)) {
    console.warn(
      `Invalid ModalStyle: "${modalStyle}". 사용불가능한 모달 스타일입니다.`
    );
    modalStyle = "primary"; // 기본값 설정
  }

  // 아이콘 및 색상 설정
  let icon;
  let iconColor;
  let buttonColor;

  switch (modalStyle) {
    case "primary":
      icon = "info"; // info 아이콘
      iconColor = "primary"; // 아이콘 색상
      buttonColor = "primary"; // 버튼 색상
      break;
    case "success":
      icon = "check"; // 성공 아이콘
      iconColor = "success"; // 아이콘 색상
      buttonColor = "success"; // 버튼 색상
      break;
    case "warning":
      icon = "warning"; // 경고 아이콘
      iconColor = "warning"; // 아이콘 색상
      buttonColor = "warning"; // 버튼 색상
      break;
    default:
      icon = "info"; // 기본 아이콘
  }

  // 모달 HTML 요소 생성
  const modalHTML = document.createElement("div");
  modalHTML.className = "modal-container";

  // 모달 내용 설정
  modalHTML.innerHTML = `
<div class="modal hidden">
      <div class="modal__overlay"></div>
      <div class="modal__content">
        <div class="modal__header-container">
          <div class="material-icons material-icons--${iconColor}">${icon}</div>
          <h1>${title}</h1>
        </div>
        <div class="modal__message">
          ${message}
        </div>
        <div class="modal__btn-container">
          <button class="btn btn--confirm btn--${buttonColor}__confirm">확인</button>
          ${showCancelBtn ? `<button class="btn btn--cancel btn--${buttonColor}__cancel">취소</button>` : ""}
        </div>
      </div>
    </div>
    `;

  // 모달 관련 요소 선택
  const modal = modalHTML.querySelector(".modal"); // 모달 요소
  const overlay = modal.querySelector(".modal__overlay"); // 오버레이 요소
  const confirmBtn = modal.querySelector(`.btn--confirm`); // 확인 버튼
  const cancelBtn = modal.querySelector(".btn--cancel"); // 취소 버튼

  // 모달 열기 함수
  const openModal = () => {
    modal.classList.remove("hidden"); // 모달을 보이도록 설정
  };

  // 모달 닫기 함수
  const closeModal = () => {
    modal.classList.add("hidden"); // 모달을 숨기도록 설정
    modalHTML.remove();
  };

  // 이벤트 리스너 설정
  overlay.addEventListener("click", closeModal); // 오버레이 클릭 시 모달 닫기
  confirmBtn.addEventListener("click", closeModal); // 확인 버튼 클릭 시 모달 닫기

  confirmBtn.addEventListener("click", () => {
    if (onConfirm) {
      onConfirm(); // 확인 버튼 클릭 시 onConfirm 호출
    }
    closeModal(); // 모달 닫기
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal); // 취소 버튼 클릭 시 모달 닫기
  }
  // 모달 열기 버튼 클릭 시 모달 열기
  const modalBtn = document.getElementById("modal-btn");
  if (modalBtn) {
    modalBtn.addEventListener("click", openModal);
  }

  return {
    modalHTML,
    openModal,
    closeModal,
  };
}
