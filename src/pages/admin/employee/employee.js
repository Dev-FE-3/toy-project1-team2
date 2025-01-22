import Modal from "@/components/Modal/modal";

const empUtils = {
  deleteModal(onConfirm) {
    const modal = Modal({
      title: "직원 삭제",
      message: "정말로 삭제하시겠습니까?",
      modalStyle: "warning",
      onConfirm,
    });
    document.body.appendChild(modal);
    modal.querySelector(".modal").classList.remove("hidden");
  },
  infoModal(message, modalStyle = "primary") {
    const modal = Modal({
      title: "안내",
      message,
      modalStyle,
      showCancelBtn: false,
    });
    document.body.appendChild(modal);
    modal.querySelector(".modal").classList.remove("hidden");
  }
};

export default empUtils;
