// 로컬 스토리지에서 데이터를 가져오는 함수
export const fetchFromLocalStorage = (key) => {
  const record = localStorage.getItem(key);
  if (record) {
    return JSON.parse(record); // JSON 문자열을 객체로 변환
  }
  return undefined; // 데이터가 없을 경우 빈 배열 반환
};

// 공용 유틸 함수: 로컬 스토리지에 데이터 추가
export const addToLocalStorage = (key, value) => {
  const existingData = fetchFromLocalStorage(key) || []; // 기존 데이터 가져오기
  existingData.push(value); // 새 데이터 추가
  localStorage.setItem(key, JSON.stringify(existingData)); // 업데이트된 데이터 저장
};

// UUID 생성 유틸 함수
export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; // 0-15 사이의 랜덤 숫자 생성
    const v = c === "x" ? r : (r & 0x3) | 0x8; // 'x'일 경우 랜덤값, 'y'일 경우 특정 규칙 적용
    return v.toString(16); // 16진수 문자열로 변환
  });
};
