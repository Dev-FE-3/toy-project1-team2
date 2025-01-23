import "./leaveList.css";
import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/input";
import { createDropdown } from "@/components/Dropdown/dropdown";
import { createPagination } from "@/components/Pagination/pagination";
import Modal from "@/components/Modal/modal";

// 남은 휴가 일수 계산 함수
function remainingLeave() {
  const totalLeaveDays = 15; // 2025년 전체 휴가 일수
  const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
  
  const usedLeaveDays = leaves.reduce((total, leave) => {
    // 2025년도 휴가인 경우 모두 계산
    if (leave.startDate.includes('2025')) {
      return total + leave.leaveDays;
    }
    return total;
  }, 0);

  return totalLeaveDays - usedLeaveDays;
}

// 상세 페이지로 이동하는 함수
function showLeaveDetail(leaveId) {
  window.location.href = `/leave/${leaveId}`;
}

const leaveList = (container) => {
  const leaveListRender = document.createElement("div");
  leaveListRender.className = "container-wrap";

  const submitButton = createButton(
    "신청",
    () => {window.location.href = "/leave/apply"},
    ["btn--submit"],
  );
  
  const deleteButton = createButton(
    "삭제",
    () => {
      const selectedLeaves = getSelectedLeaves();
      if (selectedLeaves.length === 0) {
        alert("삭제할 항목을 선택해주세요.");
        return;
      }

      const modal = Modal({
        title: "휴가 삭제",
        message: "정말로 선택한 휴가를 삭제하시겠습니까?",
        modalStyle: "warning",
        onConfirm: () => {
          deleteSelectedLeaves(selectedLeaves);
          fetchAndRenderTable(currentFilter, currentPage);
        },
      });
      document.body.appendChild(modal);
      modal.querySelector('.modal').classList.remove('hidden');
    },
    ["btn--delete"]
  );

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
    <div class="content-wrap leave-list">
      <div class="content-top">
        <div class="filter">
          <!-- 드롭다운 삽입 영역 -->
        </div>
        <div class="remaining-wrap">
          <span>잔여휴가</span>
          <span class="remaining-leave">10</span>
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

  container.appendChild(leaveListRender);
  document.querySelector(".buttons").appendChild(submitButton);
  document.querySelector(".buttons").appendChild(deleteButton);
  document.querySelector(".select-all-wrap").appendChild(checkAllInput);
  const tableBody = document.querySelector(".table-body");
  const paginationContainer = document.querySelector(".pagination-container");

  // 페이지네이션 업데이트 함수
  function updatePagination() {
    const remainingItems = document.querySelectorAll('tbody tr').length;
    renderPagination(remainingItems);
    
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

  // 선택된 휴가 항목 가져오기
  function getSelectedLeaves() {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.closest('tr').firstElementChild.textContent);
  }

  // 선택된 휴가 삭제
  function deleteSelectedLeaves(selectedIds) {
    let leaves = JSON.parse(localStorage.getItem("leaves")) || [];
    leaves = leaves.filter(leave => !selectedIds.includes(String(leave.id)));
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }

  // 체크박스 선택/해제
  function toggleSelectAll() {
    const selectAllCheckbox = document.querySelector(".select-all");
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
  let currentFilter = "전체";

  function fetchAndRenderTable(filterValue = currentFilter, page = 1) {
    currentFilter = filterValue;
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    try {
      let leavesData = JSON.parse(localStorage.getItem("leaves")) || [];
    
      if (leavesData.length === 0) {
        throw new Error("로컬 스토리지에 leaves 데이터가 없습니다.");
      }

      // 신청일 기준으로 정렬
      leavesData.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));

      totalItems = leavesData.length;
      tableBody.innerHTML = '';

      const filteredData = leavesData.filter(item => filterValue === "전체" || item.leaveType === filterValue);
      const pageData = filteredData.slice(startIdx, endIdx);

      pageData.forEach((item, index) => {
        const isUsedTextStyle = item.isUsed ? 'style="color: #BEBEBE;"' : '';
        const isUsedCheckbox = item.isUsed ? 'disabled' : ''; 

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${startIdx + index + 1}</td>
          <td>${item.applicationDate}</td>
          <td>${item.startDate}</td>
          <td>${item.endDate}</td>
          <td>${item.leaveType}</td>
          <td>${item.halfDayTypeId || '-'}</td>
          <td>${item.leaveDays}</td>
          <td ${isUsedTextStyle}>${item.isUsed ? "사용완료" : "사용안함"}</td>
          <td><input type="checkbox" ${isUsedCheckbox}></td>
        `;

        row.addEventListener('click', (event) => {
          if (event.target.type !== 'checkbox') {
            showLeaveDetail(item.id);
          }
        });

        tableBody.appendChild(row);
      });

      // 남은 휴가 일수 표시
      const remainingDays = remainingLeave();
      document.querySelector(".remaining-leave").textContent = remainingDays;

      renderPagination(filteredData.length);

    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
      tableBody.innerHTML = '<tr><td colspan="9">데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.</td></tr>';
    }
  }

  // 페이지네이션 렌더링 함수
  function renderPagination(totalItems) {
    paginationContainer.innerHTML = "";
    const pagination = createPagination({
      totalItems,
      itemsPerPage,
      currentPage,
      onPageChange: (page) => {
        currentPage = page;
        fetchAndRenderTable(currentFilter, currentPage);
      },
    });
    paginationContainer.appendChild(pagination);
  }

  // 드롭다운 선택 시 필터링
  const dropdownItems = document.querySelectorAll(".dropdown_item");
  const placeholder = document.querySelector(".placeholder_active");

  dropdownItems.forEach(item => {
    item.addEventListener("click", () => {
      const selectedValue = item.textContent.trim();
      placeholder.textContent = selectedValue;
      currentPage = 1;
      fetchAndRenderTable(selectedValue, currentPage);
    });
  });

  // 전체 선택 체크박스에 클릭 이벤트 추가
  document.querySelector(".select-all").addEventListener("change", toggleSelectAll);

  // 초기 데이터 불러오기
  fetchAndRenderTable(currentFilter, currentPage);
}

export default leaveList;