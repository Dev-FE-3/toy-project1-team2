import "./leaveList.css";

import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/input";
import { createDropdown } from "@/components/Dropdown/dropdown";
import { createPagination } from "@/components/Pagination/pagination"

// 휴가 데이터 로컬스토리지에서 불러오기
const leaves = JSON.parse(localStorage.getItem("leaves"));

const leaveList = (container) => {
  // 휴가 목록 기본 레이아웃
  const leaveListRender = document.createElement("div");
  leaveListRender.className = "container-wrap";

  const submitButton = createButton(
    "신청",
    () => {window.location.href="javascript:void(0)"},
    ["btn--submit"]
  );
  const deleteButton = createButton(
    "삭제",
    () => {alert("삭제 버튼 클릭")},
    ["btn--delete"]
  );

  // 전체 선택 체크박스 생성
  const checkAllInput = createInputField({
    type: "checkbox",
    attributes: { name: "checkAll", classList: ["select-all"] },
  });

  leaveListRender.innerHTML = `
    <div class="header">
      <h1>휴가목록</h1>
      <div class="buttons">
        <!-- 버튼 삽입 영역 -->
      </div>
    </div>
    <div class="content-wrap">
      <div class="content-top">
        <div class="filter">
          <!-- 드롭다운 삽입 영역 -->
        </div>
      </div>
      <table>
        <thead>
          <th>번호</th>
          <th>휴가신청일</th>
          <th>휴가시작일</th>
          <th>휴가종료일</th>
          <th>휴가유형</th>
          <th>반차구분</th>
          <th>휴가일수</th>
          <th>사용여부</th>
          <th class="select-all-wrap"></th>
        </thead>
        <tbody class="table-body">
          <!-- 데이터 불러올 영역 -->
        </tbody>
      </table>
    </div>
    <div class="pagination-container">
      <!-- 페이지네이션 영역 -->
    </div>
  `;

  container.appendChild(leaveListRender); // 화면에 렌더링
  document.querySelector(".buttons").appendChild(submitButton);
  document.querySelector(".buttons").appendChild(deleteButton);
  document.querySelector(".select-all-wrap").appendChild(checkAllInput);
  const tableBody = document.querySelector(".table-body");
  const paginationContainer = document.querySelector(".pagination-container");
  
  // 페이지네이션 업데이트 함수
  function updatePagination() {
    const remainingItems = document.querySelectorAll('tbody tr').length;
    renderPagination(remainingItems);
    
    // 현재 페이지에 항목이 없으면 이전 페이지로 이동
    if (remainingItems === 0 && currentPage > 1) {
      currentPage--;
      fetchAndRenderTable(currentFilter, currentPage);
    } else if (remainingItems > 0) {
      fetchAndRenderTable(currentFilter, currentPage);
    }
  }

  // 필터 드롭다운 생성
  const filter = document.querySelector(".filter");
  const options = ["전체", "연차", "반차"];
  const dropdown = createDropdown({
    placeholder: "선택",
    options,
  });
  filter.appendChild(dropdown);

  // 체크박스 선택/해제
  function toggleSelectAll() {
    const selectAllCheckbox =document.querySelector(".select-all");
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
      if (!checkbox.disabled) {
        checkbox.checked = selectAllCheckbox.checked;
      }
    });
  }

  // 페이지네이션을 위한 변수들
  let totalItems = 0;
  const itemsPerPage = 7;
  let currentPage = 1;
  let currentFilter = "전체"; // 현재 필터 상태를 저장하는 변수 추가

  async function fetchAndRenderTable(filterValue = currentFilter, page = 1) {
    currentFilter = filterValue; // 현재 필터 값 저장
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    try {
      // 로컬 스토리지에서 leaves 데이터 가져오기
      const leavesData = JSON.parse(localStorage.getItem("leaves"));
      
      if (!leavesData) {
        throw new Error("로컬 스토리지에 leaves 데이터가 없습니다.");
      }

      totalItems = leavesData.length; // 전체 항목 수 업데이트

      // 테이블 초기화
      tableBody.innerHTML = '';

      // 필터링 및 데이터 표시
      const filteredData = leavesData.filter(item => filterValue === "전체" || item.leaveType === filterValue);
      const pageData = filteredData.slice(startIdx, endIdx);

      pageData.forEach((item) => {
        const isUsedTextStyle = item.isUsed ? 'style="color: #BEBEBE;"' : '';
        const isUsedCheckbox = item.isUsed ? 'disabled' : ''; 

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.applicationDate}</td>
          <td>${item.startDate}</td>
          <td>${item.endDate}</td>
          <td>${item.leaveType}</td>
          <td>${item.halfDayTypeId || '-'}</td>
          <td>${item.leaveDays}</td>
          <td ${isUsedTextStyle}>${item.isUsed ? "사용완료" : "사용안함"}</td>
          <td><input type="checkbox" ${isUsedCheckbox}></td>
        `;

        tableBody.appendChild(row); // <tbody>에 <tr> 추가
      });

      // 페이지네이션 렌더링
      renderPagination(filteredData.length);

    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
      tableBody.innerHTML = '<tr><td colspan="9">데이터를 가져오는 중 오류가 발생했습니다.</td></tr>';
    }
  }

  // 페이지네이션 렌더링 함수
  function renderPagination(totalItems) {
    paginationContainer.innerHTML = ""; // 이전 페이지네이션 초기화
    const pagination = createPagination({
      totalItems,
      itemsPerPage,
      currentPage,
      onPageChange: (page) => {
        currentPage = page;
        fetchAndRenderTable(currentFilter, currentPage); // 현재 필터 값을 유지하면서 페이지 변경
      },
    });
    paginationContainer.appendChild(pagination);
  }

  // 드롭다운 선택 시 필터링
  const dropdownItems = document.querySelectorAll(".dropdown_item");
  const placeholder = document.querySelector(".placeholder_active");

  dropdownItems.forEach(item => {
    item.addEventListener("click", () => {
      const selectedValue = item.textContent.trim(); // 클릭된 아이템의 텍스트 값을 가져옴
      placeholder.textContent = selectedValue; // 선택된 값으로 placeholder 업데이트
      currentPage = 1; // 페이지를 1로 리셋
      fetchAndRenderTable(selectedValue, currentPage); // 선택된 값에 맞는 데이터를 렌더링
    });
  });

  // 전체 선택 체크박스에 클릭 이벤트 추가
  document.querySelector(".select-all").addEventListener("change", toggleSelectAll);

  // 초기 데이터 불러오기
  fetchAndRenderTable(currentFilter, currentPage);
}

export default leaveList; 