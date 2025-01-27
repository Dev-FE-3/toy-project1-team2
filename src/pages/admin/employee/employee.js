import Modal from "@/components/Modal/modal";

const empUtils = {
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
  validationRules: {
    name: {
      regExp: /^.{0,50}$/,
      message: "50자 이내로 입력해주세요",
    },
    address: {
      regExp: /^.{0,100}$/,
      message: "100자 이내로 입력해주세요",
    },
    hireDate: {
      regExp: /^\d{4}-\d{2}-\d{2}$/,
      message: "유효한 날짜를 입력해 주세요",
    },
    birthDate: {
      regExp: /^\d{4}-\d{2}-\d{2}$/,
      message: "유효한 날짜를 입력해 주세요",
    },
    phone: {
      regExp: /^(01[0-9])-(\d{3,4})-(\d{4})$/,
      message: "유효한 연락처를 입력해 주세요",
    },
    email: {
      regExp: /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "유효한 이메일을 입력해 주세요",
    },
    required: {
      message: "필수 입력 항목입니다",
    },
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

export default empUtils;
