import "./employee.css";

import { createButton } from "../../../components/Button/Button";
import { createInputField } from "../../../components/InputField/input";
import axios from "axios";

const employeeList = async (container) => {
  const contentWrapHTML = document.createElement("div");
  contentWrapHTML.className = "content__wrap";

  contentWrapHTML.innerHTML = `
    <div class="content-wrap">
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
                    attributes: { classList: ["check-all"] },
                  }).outerHTML
                }
              </th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  // json 데이터 가져와서 직원 리스트 생성
  const employees = await getEmployeesData();
  const tbodyEl = contentWrapHTML.querySelector("tbody");

  employees.forEach((emp, idx) => {
    const trEl = document.createElement("tr");
    trEl.innerHTML = createEmployeeCells(emp, idx + 1);
    tbodyEl.appendChild(trEl);
  });

  container.appendChild(contentWrapHTML);
};

const createEmployeeCells = (data, index) => {
  return `
    <td>${index}</td>
    <td>
      <a href="/admin/employee/${data.id}">
        <div class="employee-info-wrap">
          <img src="${data.ptofileImage}" alt="직원 프로필 사진">
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
          attributes: { classList: ["check-emp"] },
          datasets: { id: data.id },
        }).outerHTML
      }
    </td>
  `;
};

const getEmployeesData = async () => {
  try {
    const res = await axios.get("/api/employees.json");
    return res.data.employees;
  } catch (err) {
    console.error("Error get employees data", err);
  }
};

export default employeeList;
