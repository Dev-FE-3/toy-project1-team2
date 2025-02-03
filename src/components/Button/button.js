import "./button.css";

// 버튼 컴포넌트 생성 함수
export function createButton({ text, onClick, classNames = [] }) {
  const button = document.createElement("button");

  // 기본 클래스 btn
  button.classList.add("btn");
  // 버튼에 들어갈 텍스트 입력
  button.textContent = text;
  // 추가 클래스 있는 경우 입력
  classNames.forEach((className) => button.classList.add(className));
  // 클릭 이벤트 추가
  button.addEventListener("click", onClick);

  return button;
}