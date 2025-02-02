// 입력된 데이터를 "시:분" 형식으로 반환하는 함수
export const formatTime = (input) => {
  // 유효하지 않은 입력 처리
  if (!input || isNaN(new Date(input))) {
    return "-"; // 유효하지 않은 경우 "-" 반환
  }
  const date = new Date(input);
  const hours = date.getHours().toString().padStart(2, "0"); // 시
  const minutes = date.getMinutes().toString().padStart(2, "0"); // 분
  return `${hours}:${minutes}`; // "시:분" 형식으로 반환
};

// 년-월-일 시:분:초 형식으로 반환하는 함수 ex)2025-01-23 18:22:10
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 날짜 및 시간 문자열을 개별 요소로 분리하는 함수
export const parseDateTimeString = (dateTimeString) => {
  const [datePart, timePart] = dateTimeString.split(" ");

  // 날짜 부분 분리
  const [year, month, day] = datePart.split("-").map(Number);

  // 시간 부분 분리
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  return { year, month, day, hours, minutes, seconds };
};

// 유효한 날짜 형식인지 확인하는 함수
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // 유효한 날짜인지 확인
};
