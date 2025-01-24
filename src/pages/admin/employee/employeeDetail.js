import "./employee.css";

import { createButton } from "@/components/Button/button";
import empUtils from "./employee";


const employeeDetail = (container, id) => {
  const employees = JSON.parse(localStorage.getItem("employees"));
  if (!Number.isInteger(Number(id)) || id < 1 || id > employees.length) {
    window.location.href = "/admin/employee";
  }

  const contentWrapHTML = document.createElement("div");
  contentWrapHTML.className = "content-wrap";

  // 버튼 생성
  const editButton = createButton("수정", null, ["btn", "btn--edit"]);
  const deleteButton = createButton(
    "삭제",
    () => {
      empUtils.deleteModal(() => {
        employees.splice(id - 1, 1);
        localStorage.setItem("employees", JSON.stringify(employees));
        window.location.href = "/admin/employee";
      });
    },
    ["btn", "btn--delete"]
  );

  const employee = employees[id - 1];
  contentWrapHTML.innerHTML = `
    <div class="header">
      <h2 class="header__title">직원정보 상세</h2>
      <div class="header__btn">
        <a href="/admin/employee/write/${id}">${editButton.outerHTML}</a>
      </div>
    </div>
    <div class="employee-detail">
      <!-- 프로필 사진 영역 -->
      <div class="profile">
        <div class="profile__image" title="프로필 사진">
          <img src="${employee.profileImage}">
        </div>
        <div class="profile__card">
          <p class="name">${employee.name}</p>
          <span class="employee-position">${employee.position}</span>
        </div>
      </div>

      <!-- 인사 정보 영역 -->
      <table>
        <colgroup>
          <col>
          <col width="31%">
          <col width="31%">
        </colgroup>
        <thead>
          <tr>
            <th colspan="3">인사 정보</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="data-wrap">
                <div class="label">사번</div>
                <div class="data">${employee.employeeNumber}</div>
              </div>
            </td>
            <td>
              <div class="data-wrap">
                <div class="label">입사일</div>
                <div class="data">${employee.hireDate}</div>
              </div>
            </td>
            <td>
              <div class="data-wrap">
                <div class="label">직무</div>
                <div class="data">${employee.position}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 기본 정보 영역 -->
      <table>
        <colgroup>
          <col>
          <col width="31%">
          <col width="31%">
        </colgroup>
        <thead>
          <tr>
            <th colspan="3">기본 정보</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="data-wrap">
                <div class="label">이름</div>
                <div class="data">${employee.name}</div>
              </div>
            </td>
            <td>
              <div class="data-wrap">
                <div class="label">생년월일</div>
                <div class="data">${employee.birthDate}</div>
              </div>
            </td>
            <td>
              <div class="data-wrap">
                <div class="label">연락처</div>
                <div class="data">${employee.phone}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="data-wrap">
                <div class="label">이메일</div>
                <div class="data">${employee.email}</div>
              </div>
            </td>
            <td colspan="4">
              <div class="data-wrap">
                <div class="label">주소</div>
                <div class="data">${employee.address}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  contentWrapHTML.querySelector(".header__btn").appendChild(deleteButton);
  container.appendChild(contentWrapHTML);
};

export default employeeDetail;
