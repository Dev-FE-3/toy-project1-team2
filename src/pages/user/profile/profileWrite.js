import "@/pages/admin/employee/employee.css";

import Modal from "@/components/Modal/modal";
import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/input";
import InputValidation from "@/components/InputField/inputValidation";

const EMPLOYEE_INDEX = 0; // 임시로 첫번째 직원 데이터 출력
const employee = JSON.parse(localStorage.getItem("employees"))[EMPLOYEE_INDEX];

const BASIC_PROFILE_IMG = "/src/assets/images/profile/profile-basic.png";
let currentProfileImage = "";

const profileWrite = (container) => {
  const contentWrapHTML = document.createElement("div");
  contentWrapHTML.className = "content-wrap";

  // 버튼 생성
  const submitButton = createButton("저장", null, ["btn", "btn--submit"]);
  const cancleButton = createButton("취소", null, ["btn", "btn--delete"]);
  const cancleLink = `/profile`;

  contentWrapHTML.innerHTML = `
    <div class="header">
      <h2 class="header__title">내프로필 수정</h2>
      <div class="header__btn">
        ${submitButton.outerHTML}
        <a href="${cancleLink}">${cancleButton.outerHTML}</a>
      </div>
    </div>
    <div class="employee-detail">
      <form class="wrtie-form">
        <!-- 프로필 사진 영역 -->
        <div class="profile">
          <div class="profile__image" title="프로필 사진">
            <img src="${employee.profileImage || BASIC_PROFILE_IMG}"></img>
          </div>
          <div class="profile__btn">
            <button class="btn--upload" type="button">사진 설정</button>
            <button class="btn--delete 
                    ${employee.profileImage !== BASIC_PROFILE_IMG ? "" : "hidden"}" 
                    type="button">사진 삭제</button>
          </div>
          <input type="file" accept=".jpg, .jpeg, .png" name="ptofileImage"/>
        </div>

        <!-- 인사 정보 영역 -->
        <table>
          <colgroup>
            <col width="34%">
            <col width="34%">
            <col >
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
            <col width="34%">
            <col width="34%">
            <col >
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

        <!-- 비밀번호 영역 -->
        <table>
          <colgroup>
            <col width="34%">
            <col width="34%">
            <col >
          </colgroup>
          <thead>
            <tr>
              <th colspan="3">기본 정보</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                ${
                  createInputField({
                    type: "password",
                    label: { name: "비밀번호", forAttr: "password" },
                    attributes: {
                      name: "password",
                      id: "password",
                      placeholder: "최소 6자, 최대 16자까지 설정 가능",
                    },
                    datasets: {
                      required: true,
                      validation: true,
                    },
                  }).outerHTML
                }
              </td>
              <td>
                ${
                  createInputField({
                    type: "password",
                    label: {
                      name: "비밀번호 확인",
                      forAttr: "confirmPassword",
                    },
                    attributes: {
                      name: "confirmPassword",
                      id: "confirmPassword",
                      placeholder: "최소 6자, 최대 16자까지 설정 가능",
                    },
                    datasets: {
                      required: true,
                      validation: true,
                    },
                  }).outerHTML
                }
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  `;

  // 입력 폼 유효성 검사 설정
  const validationRules = {
    password: {
      regExp: /^[a-zA-Z0-9!@#$%^&*()]{6,16}$/,
      message: "최소 6자, 최대 16자까지 입력해주세요",
    },
    confirmPassword: {
      regExp: /^[a-zA-Z0-9!@#$%^&*()]{6,16}$/,
      message: "최소 6자, 최대 16자까지 입력해주세요",
    },
    passwordMismatch: {
      message: "비밀번호가 일치하지 않습니다",
    },
    required: {
      // 필수 설정
      message: "필수 입력 항목입니다",
    },
  };
  
  bindProfileImageEvents(contentWrapHTML);
  container.appendChild(contentWrapHTML);

  new InputValidation(contentWrapHTML, validationRules, handleFormSubmit);
};

const handleFormSubmit = () => {
  const employees = JSON.parse(localStorage.getItem("employees"));
  const formData = new FormData(document.querySelector("form"));

  // 이미지 데이터 저장
  employees[EMPLOYEE_INDEX].profileImage =
    currentProfileImage || employee.profileImage;

  // 로컬 스토리지 갱신
  localStorage.setItem("employees", JSON.stringify(employees));
  
  // 모달 안내 후 페이지 이동
  const modal = Modal({
    title: "안내",
    message: "정상적으로 변경되었습니다",
    modalStyle: "success",
    onConfirm: () => {
      window.location.href = "/profile";
    },
    showCancelBtn: false,
  });
  document.body.appendChild(modal);
  modal.querySelector(".modal").classList.remove("hidden");
};

const bindProfileImageEvents = (contentWrapHTML) => {
  const fileEl = contentWrapHTML.querySelector(".profile input");
  const profileImageEl = contentWrapHTML.querySelector(".profile__image img");
  const profileUploadBtnEl = contentWrapHTML.querySelector(
    ".profile .btn--upload"
  );
  const profileDeleteBtnEl = contentWrapHTML.querySelector(
    ".profile .btn--delete"
  );

  profileUploadBtnEl.addEventListener("click", () => fileEl.click());

  profileDeleteBtnEl.addEventListener("click", () => {
    fileEl.value = "";
    profileImageEl.src = BASIC_PROFILE_IMG;
    profileDeleteBtnEl.classList.add("hidden");
    currentProfileImage = BASIC_PROFILE_IMG;
  });

  fileEl.addEventListener("change", () => {
    if (fileEl.files.length > 0) {
      // 사진 첨부된 상태면 삭제 버튼 노출
      profileDeleteBtnEl.classList.remove("hidden");

      // 프로필 사진 화면에 로드
      const reader = new FileReader();
      reader.onload = (event) => {
        profileImageEl.src = event.target.result;
        currentProfileImage = event.target.result;
      };
      reader.readAsDataURL(fileEl.files[0]);
    } else {
      profileImageEl.src = BASIC_PROFILE_IMG;
      profileDeleteBtnEl.classList.add("hidden");
    }
  });
};

export default profileWrite;
