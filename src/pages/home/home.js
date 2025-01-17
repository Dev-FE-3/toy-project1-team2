import Modal from "../../components/Modal/Modal.js";

const home = (contents) => {
  contents.innerHTML = `
    <div id="home">메인홈</div>
    <button id="modal-btn">모달 열기</button>
  `;

  // 모달 모달 사용방법
  // // 모달 생성
  // const modal = Modal({
  //   title: "안내",
  //   message: "모달이 성공적으로 열렸습니다!",
  //   modalStyle: "success", // 원하는 스타일
  //   onConfirm: () => {
  //     console.log("확인 버튼 클릭됨");
  //   },
  //   showCancelBtn: true, // 취소 버튼 표시
  // });

  // // 모달 버튼 클릭 시 모달 열기
  // const modalBtn = document.getElementById("modal-btn");
  // modalBtn.addEventListener("click", () => {
  //   document.body.appendChild(modal); // 모달을 DOM에 추가
  //   const openModal = modal.querySelector(".modal"); // 모달 요소 선택
  //   openModal.classList.remove("hidden"); // 모달 열기
  // });
};

export default home;
