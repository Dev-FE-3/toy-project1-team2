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

  contentWrapHTML.innerHTML = `
    <div class="header">
      <h2 class="header__title">직원관리</h2>
      <div class="header__btn">
        ${createButton("등록", null, ["btn", "btn--submit"]).outerHTML}
        ${createButton("삭제", null, ["btn", "btn--delete"]).outerHTML}
      </div>
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
            <th>
              ${
                createInputField({
                  type: "checkbox",
                  attributes: { name: "checkAll", classList: ["check-all"] },
                }).outerHTML
              }
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  container.appendChild(contentWrapHTML); // 화면에 렌더링

  bindButtonEvent(); // 버튼 이벤트 바인딩
  renderEmployeeList(START_PAGE); // 직원 리스트 생성
};

const bindButtonEvent = () => {
  // 삭제 버튼(체크된 직원 삭제)
  const deleteBtnEl = document.querySelector(".btn--delete");
  deleteBtnEl.addEventListener("click", () => {
    const checkEl = document.querySelector("tbody input:checked");
    if (checkEl) {
      empUtils.deleteModal(deleteSelectedEmployees);
    } else {
      empUtils.infoModal("삭제할 직원을 선택해 주세요.");
    }
  });

  // 등록 버튼
  const createBtnEl = document.querySelector(".btn--submit");
  createBtnEl.addEventListener(
    "click",
    () => (window.location.href = "/admin/employee/write")
  );
};

const bindCheckAllEvent = () => {
  const checkAllEl = document.querySelector(".check-all");
  const checkEls = document.querySelectorAll("tbody input[type=checkbox]");
  checkAllEl.checked = false; // false로 초기화
  checkAllEl.addEventListener("change", () => {
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

  // 삭제 후 리스트 재생성
  const totalPage = Math.ceil(employees.length / ITEM_PER_PAGE);
  const page = document.querySelector(".pagination-button.active").dataset.page;
  renderEmployeeList(parseInt(page > totalPage ? totalPage : page));

  // 로컬스토리지 데이터 수정
  localStorage.setItem("employees", JSON.stringify(employees));
  empUtils.infoModal("정상적으로 삭제되었습니다.", "success");
};

const renderEmployeeList = (page) => {
  const tbodyEl = document.querySelector("tbody");
  tbodyEl.innerHTML = ""; // 직원 목록 초기화

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
  const pagenationContainer = document.querySelector(".pagination-container");
  if (pagenationContainer) pagenationContainer.remove();
  document.querySelector(".content-wrap").appendChild(
    createPagination({
      totalItems: employees.length,
      itemsPerPage: ITEM_PER_PAGE,
      currentPage: page,
      onPageChange: renderEmployeeList,
    })
  );

  bindCheckAllEvent(); // 전체 선택 이벤트
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
