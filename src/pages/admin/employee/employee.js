import Modal from "@/components/Modal/modal";

const utils = {
  deleteModal(onConfirm) {
    const modal = Modal({
      title: "직원 삭제",
      message: "정말로 삭제하시겠습니까?",
      modalStyle: "warning",
      onConfirm,
    });
    document.body.appendChild(modal.modalHTML);
    modal.openModal();
  },
  infoModal(message, modalStyle = "primary") {
    const modal = Modal({
      title: "안내",
      message,
      modalStyle,
      showCancelBtn: false,
    });
    document.body.appendChild(modal.modalHTML);
    modal.openModal();
  },
  generateEmployeeNumber(hireDate, employeeId) {
    let employeeNumber = "";
    employeeNumber += hireDate.getFullYear().toString().slice(-2);
    employeeNumber += (hireDate.getMonth() + 1).toString().padStart(2, "0");
    employeeNumber += hireDate.getDate().toString().padStart(2, "0");
    employeeNumber += employeeId.toString().padStart(3, "0");
    return employeeNumber;
  },
  getEmployeeData(idx) {
    const employees = JSON.parse(localStorage.getItem("employees"));
    if (idx >= 0 && idx < employees.length) {
      return employees[idx];
    } else {
      window.location.href = "/admin/employee";
    }
  },
};

export default utils;