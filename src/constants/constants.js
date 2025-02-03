export const WORK_RECORD_URL = "/src/data/workRecord.json";
export const WORK_RECORD_KEY = "workRecord"; // 로컬 스토리지 키 상수

// employee page start
export const EMPLOYEE_VALIDATION_RULES = {
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
};
// employee page end
