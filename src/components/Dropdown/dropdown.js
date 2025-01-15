// 드롭다운 CSS 로드 함수
function loadDropdownStylesheet() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./src/components/Dropdown/style.css";
  document.head.appendChild(link);
}

// 드롭다운 HTML 생성 및 이벤트 바인딩
export const createDropdown = ({ placeholder = null, options = [] } = {}) => {
  if (!options) {
    throw new Error("options is required.");
  }
  loadDropdownStylesheet();

  // Placeholder가 없으면 options[0]을 기본 표시로 설정
  const initialText = placeholder || options[0];

  // 컨테이너 요소 생성
  const dropdownHTML = document.createElement("div");
  dropdownHTML.className = "dropdown_main";

  // HTML 코드 문자열
  dropdownHTML.innerHTML = `
        <div class="dropdown_bar">
            <p class="${placeholder ? "placeholder_active" : ""}">${initialText}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" class="drop_icon1" viewBox="0 0 16 9" fill="none">
            <path d="M15.7387 1.52364L8.63082 8.63475C8.54823 8.71806 8.44996 8.78419 8.34169 8.82932C8.23342 8.87445 8.11729 8.89768 8 8.89768C7.88271 8.89768 7.76658 8.87445 7.65831 8.82932C7.55004 8.78419 7.45177 8.71806 7.36918 8.63475L0.261296 1.52364C0.0939908 1.35626 -2.49304e-09 1.12924 0 0.892526C2.49304e-09 0.655813 0.0939908 0.428796 0.261296 0.261415C0.428601 0.0940338 0.655515 2.49417e-09 0.89212 0C1.12873 -2.49417e-09 1.35564 0.0940338 1.52294 0.261415L8 6.7503L14.4771 0.261415C14.6444 0.0940338 14.8713 0 15.1079 0C15.3445 0 15.5714 0.0940338 15.7387 0.261415C15.906 0.428796 16 0.655813 16 0.892526C16 1.12924 15.906 1.35626 15.7387 1.52364Z" fill="#BEBEBE"/>
            </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9" fill="none" class="drop_icon2" style="display: none;">
            <path d="M0.261296 7.37407L7.36918 0.262959C7.45177 0.179644 7.55004 0.113515 7.65831 0.068387C7.76658 0.0232593 7.88271 2.57492e-05 8 2.57492e-05C8.11729 2.57492e-05 8.23342 0.0232593 8.34169 0.068387C8.44996 0.113515 8.54823 0.179644 8.63082 0.262959L15.7387 7.37407C15.906 7.54145 16 7.76847 16 8.00518C16 8.24189 15.906 8.46891 15.7387 8.63629C15.5714 8.80367 15.3445 8.89771 15.1079 8.89771C14.8713 8.89771 14.6444 8.80367 14.4771 8.63629L8 2.1474L1.52294 8.63629C1.35564 8.80367 1.12872 8.89771 0.892119 8.89771C0.655514 8.89771 0.428601 8.80367 0.261296 8.63629C0.0939912 8.46891 0 8.24189 0 8.00518C0 7.76847 0.0939912 7.54145 0.261296 7.37407Z" fill="#BEBEBE"/>
            </svg>
        </div>   
        <div class="dropdown_content">
            ${options.map((option) => `<div class="dropdown_item" >${option}</div>`).join("")}
        </div>
    `;

  const dropdownBar = dropdownHTML.querySelector(".dropdown_bar");
  const dropdownHeader = dropdownHTML.querySelector(".dropdown_bar p");
  const dropdownContent = dropdownHTML.querySelector(".dropdown_content");
  const drop_icon1 = dropdownHTML.querySelector(".drop_icon1");
  const drop_icon2 = dropdownHTML.querySelector(".drop_icon2");

  // 드롭다운 열기/닫기
  dropdownBar.addEventListener("click", function () {
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
      drop_icon1.style.display = "inline-flex";
      drop_icon2.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
      drop_icon1.style.display = "none";
      drop_icon2.style.display = "inline-flex";
    }
  });

  // 드롭다운 아이템 클릭 시 선택된 값 갱신
  const dropdownItems = dropdownHTML.querySelectorAll(".dropdown_item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      const selectedOption = this.textContent.trim(); // 선택된 텍스트

      // 선택된 항목의 텍스트(selectedOption)를 드롭다운 상단 표시 영역의 텍스트로 설정
      document.querySelector(".dropdown_bar p").textContent = selectedOption;

      // 선택된 항목에 스타일 적용
      const selectedItem = dropdownHTML.querySelector(
        ".dropdown_item.selected"
      );
      if (selectedItem) {
        selectedItem.classList.remove("selected");
      } // 기존에 선택된 항목이 있으면 스타일 제거
      this.classList.add("selected");

      // placeholder 스타일 제거
      if (dropdownHeader.classList.contains("placeholder_active")) {
        dropdownHeader.classList.remove("placeholder_active");
      }

      dropdownContent.style.display = "none";
      drop_icon1.style.display = "inline-flex";
      drop_icon2.style.display = "none";
    });
  });

  return dropdownHTML;
};
