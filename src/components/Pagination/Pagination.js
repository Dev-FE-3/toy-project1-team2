function loadDropdownStylesheet() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./src/components/Pagination/style.css";
  document.head.appendChild(link);
}

export function createPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  loadDropdownStylesheet();

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const groupSize = 5; // 한 그룹의 크기 (5페이지씩 그룹화)
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1; // 현재 그룹의 시작 페이지
  const endPage = Math.min((currentGroup + 1) * groupSize, totalPages); // 현재 그룹의 끝 페이지

  // 컨테이너 요소 생성
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";

  // 페이지네이션의 HTML을 초기화
  let paginationHTML = "";

  // Prev 버튼
  paginationHTML += `<button class="pagination-button prev" ${
    currentGroup > 0 ? `data-page="${startPage - 1}"` : "disabled"
  }><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2325 4.18414C10.4622 4.423 10.4548 4.80282 10.2159 5.0325L7.06569 8L10.2159 10.9675C10.4548 11.1972 10.4622 11.577 10.2325 11.8159C10.0028 12.0547 9.62302 12.0622 9.38416 11.8325L5.78416 8.4325C5.66651 8.31938 5.60002 8.16321 5.60002 8C5.60002 7.83679 5.66651 7.68062 5.78416 7.5675L9.38416 4.1675C9.62302 3.93782 10.0028 3.94527 10.2325 4.18414Z" fill="#626262"/>
</svg></button>`;

  // 페이지 번호 버튼들
  for (let page = startPage; page <= endPage; page++) {
    paginationHTML += `<button class="pagination-button ${
      page === currentPage ? "active" : ""
    }" data-page="${page}">${page}</button>`;
  }

  // Next 버튼
  paginationHTML += `<button class="pagination-button next" ${
    endPage < totalPages ? `data-page="${endPage + 1}"` : "disabled"
  }><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.76748 11.8159C5.5378 11.577 5.54525 11.1972 5.78411 10.9675L8.93431 8L5.78411 5.0325C5.54525 4.80282 5.5378 4.423 5.76748 4.18413C5.99715 3.94527 6.37698 3.93782 6.61584 4.1675L10.2158 7.5675C10.3335 7.68062 10.4 7.83679 10.4 8C10.4 8.16321 10.3335 8.31938 10.2158 8.4325L6.61584 11.8325C6.37698 12.0622 5.99715 12.0547 5.76748 11.8159Z" fill="#626262"/>
</svg></button>`;

  // 페이지네이션 렌더링
  paginationContainer.innerHTML = paginationHTML;

  // 페이지 버튼 클릭 이벤트
  const buttons = paginationContainer.querySelectorAll(".pagination-button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const page = parseInt(e.target.getAttribute("data-page"));

      if (isNaN(page)) return; // 유효하지 않은 페이지 번호일 경우 함수 종료
      if (page !== currentPage) onPageChange(page); // 페이지 변경 시 콜백 호출
    });
  });

  return paginationContainer;
}
