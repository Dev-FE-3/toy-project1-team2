// 입력된 데이터를 "시:분" 형식으로 반환하는 함수
export const formatTime = (input) => {
  const date = new Date(input);
  const hours = date.getHours().toString().padStart(2, "0"); // 시
  const minutes = date.getMinutes().toString().padStart(2, "0"); // 분
  return `${hours}:${minutes}`; // "시:분" 형식으로 반환
};

// 유효한 날짜 형식인지 확인하는 함수
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // 유효한 날짜인지 확인
};
