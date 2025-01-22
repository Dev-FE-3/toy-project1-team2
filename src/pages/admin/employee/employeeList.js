import "./employee.css";

import empUtils from "./employee";
import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/input";
import { createPagination } from "@/components/Pagination/Pagination";

const ITEM_PER_PAGE = 5; // 한페이지에 10개의 목록만 보여줌
const START_PAGE = 1; // 처음 로드될때는 1페이지
const employees = JSON.parse(localStorage.getItem("employees")); // 직원데이터 로컬스토리지에 저장

const employeeList = (container) => {
  // 직원목록 화면 기본 틀 생성
  const contentWrapHTML = document.createElement("div");
  contentWrapHTML.className = "content-wrap";

  // 화면에 필요한 요소 생성
  const writeButton = createButton("등록", writeButtonHandler, [
    "btn",
    "btn--submit",
  ]);
  const deleteButton = createButton("삭제", deleteButtonHandler, [
    "btn",
    "btn--delete",
  ]);
  const checkAllInput = createInputField({
    type: "checkbox",
    attributes: { name: "checkAll", classList: ["check-all"] },
  });

  contentWrapHTML.innerHTML = `
    <div class="header">
      <h2 class="header__title">직원관리</h2>
      <div class="header__btn"></div>
    </div>
    <div class="employee-list">
      <table>
        <colgroup>
          <col width="5%" />
          <col width="20%" />
          <col width="10%" />
          <col width="15%" />
          <col width="20%" />
          <col width="25%" />
          <col width="5%" />
        </colgroup>
        <thead>
          <tr>
            <th>순번</th>
            <th>이름/사번</th>
            <th>직무</th>
            <th>입사일</th>
            <th class="phone">연락처</th>
            <th>이메일</th>
            <th class="check-all-wrap"></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;
  container.appendChild(contentWrapHTML); // 화면에 렌더링
  document.querySelector(".header__btn").appendChild(writeButton);
  document.querySelector(".header__btn").appendChild(deleteButton);
  document.querySelector(".check-all-wrap").appendChild(checkAllInput);

  bindSelectAllEvent();
  renderEmployeeList(START_PAGE); // 직원 리스트 생성
};

const deleteButtonHandler = () => {
  // 삭제 버튼(체크된 직원 삭제)
  const checkEl = document.querySelector("tbody input:checked");
  if (checkEl) {
    empUtils.deleteModal(deleteSelectedEmployees);
  } else {
    empUtils.infoModal("삭제할 직원을 선택해 주세요.");
  }
};

const writeButtonHandler = () => {
  window.location.href = "/admin/employee/write";
};

const bindSelectAllEvent = () => {
  const checkAllEl = document.querySelector(".check-all");
  checkAllEl.addEventListener("change", () => {
    const checkEls = document.querySelectorAll("tbody input[type=checkbox]");
    checkEls.forEach((checkEl) => {
      checkEl.checked = checkAllEl.checked;
    });
  });
};

const deleteSelectedEmployees = () => {
  const checkedEmployees = document.querySelectorAll("tbody input:checked");
  const deleteIndexList = Array.from(checkedEmployees).map((checkbox) => {
    return parseInt(checkbox.dataset.id) - 1;
  });

  // 내림차순 정렬 후 삭제(오름차순 시 삭제되면 인덱스가 변함)
  deleteIndexList.sort((a, b) => b - a);
  deleteIndexList.forEach((idx) => employees.splice(idx, 1));

  // 로컬스토리지 데이터 수정
  localStorage.setItem("employees", JSON.stringify(employees));

  // 리스트 재생성
  const totalPage = Math.ceil(employees.length / ITEM_PER_PAGE);
  const page = document.querySelector(".pagination-button.active").dataset.page;
  renderEmployeeList(parseInt(page > totalPage ? totalPage : page));

  empUtils.infoModal("정상적으로 삭제되었습니다.", "success");
};

const renderEmployeeList = (page) => {
  const tbodyEl = document.querySelector("tbody");
  tbodyEl.innerHTML = ""; // 직원 목록 초기화
  
  // 기존 페이지네이션 삭제
  const pagenationContainer = document.querySelector(".pagination-container");
  if (pagenationContainer) pagenationContainer.remove();

  // 직원 데이터가 없는 경우 메시지 표시
  if (employees.length === 0 ) {
    tbodyEl.innerHTML = "<tr><td colspan='7'>등록된 직원이 없습니다</td></tr>";
    return;
  }

  const startIdx = (page - 1) * ITEM_PER_PAGE;
  const endIdx = startIdx + ITEM_PER_PAGE;

  const list = employees.slice(startIdx, endIdx);
  list.forEach((data, idx) => {
    const index = (page - 1) * ITEM_PER_PAGE + (idx + 1); // 순번 계산
    const trEl = document.createElement("tr");
    trEl.innerHTML = createEmployeeCells(data, index);
    tbodyEl.appendChild(trEl);
  });

  // 페이지네이션 생성
  document.querySelector(".content-wrap").appendChild(
    createPagination({
      totalItems: employees.length,
      itemsPerPage: ITEM_PER_PAGE,
      currentPage: page,
      onPageChange: renderEmployeeList,
    })
  );

  // 전체 선택 체크박스 초기화
  document.querySelector(".check-all").checked = false;
};

const createEmployeeCells = (data, index) => {
  return `
    <td>${index}</td>
    <td>
      <a href="/admin/employee/${index}">
        <div class="employee-info-wrap">
          <img src="${data.profileImage}" alt="직원 프로필 사진">
          <div class="employee-info">
            <div class="employee-name">${data.name}</div>
            <div class="employee-number">${data.employeeNumber}</div>
          </div>
        </div>
      </a>
    </td>
    <td>
      <span class="employee-position">${data.position}</span>
    </td>
    <td>${data.hireDate}</td>
    <td class="phone">${data.phone}</td>
    <td>${data.email}</td>
    <td>
      ${
        createInputField({
          type: "checkbox",
          attributes: { name: "checkRow", classList: ["check-emp"] },
          datasets: { id: index },
        }).outerHTML
      }
    </td>
  `;
};

export default employeeList;
