// 입력된 데이터를 "시:분" 형식으로 반환하는 함수
export const formatTime = (input) => {
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

// 유효한 날짜 형식인지 확인하는 함수
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // 유효한 날짜인지 확인
};
