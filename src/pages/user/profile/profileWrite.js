import "./profile.css";

import Modal from "@/components/Modal/modal";
import { createButton } from "@/components/Button/button";
import { createInputField } from "@/components/InputField/input";
import InputValidation from "@/components/InputField/inputValidation";

const EMPLOYEE_INDEX = 0; // 임시로 첫번째 직원 데이터 출력
const BASIC_PROFILE_IMG = "/src/assets/images/profile/profile-basic.png";
let currentProfileImage = "";

const profileWrite = (container) => {
  const employee = JSON.parse(localStorage.getItem("employees"))[
    EMPLOYEE_INDEX
  ];

  const contentWrapHTML = document.createElement("div");
  contentWrapHTML.className = "wrapper";

  // 버튼 생성
  const submitButton = createButton({
    text: "저장",
    classNames: ["btn--submit"],
  });
  const cancleButton = createButton({
    text: "취소",
    classNames: ["btn--delete"],
  });
  const cancleLink = `/user/profile`;

  contentWrapHTML.innerHTML = `
    <div class="header">
      <h2 class="header__title">내 프로필 수정</h2>
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
        <table class="password-area">
          <colgroup>
            <col width="34%">
            <col width="34%">
            <col >
          </colgroup>
          <thead>
            <tr>
              <th colspan="3">
                <div class="title-wrap">
                  비밀번호 변경
                  <svg class="change-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </form>
    </div>
  `;

  bindProfileImageEvents(contentWrapHTML);
  bindEditPasswordChangeEvent(contentWrapHTML);
  container.appendChild(contentWrapHTML);

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
  new InputValidation(contentWrapHTML, validationRules, handleFormSubmit);
};

const handleFormSubmit = () => {
  const employees = JSON.parse(localStorage.getItem("employees"));
  const employee = JSON.parse(localStorage.getItem("employees"))[
    EMPLOYEE_INDEX
  ];

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
      window.location.href = "/user/profile";
    },
    showCancelBtn: false,
  });

  document.body.appendChild(modal.modalHTML);
  modal.openModal();
};

const bindEditPasswordChangeEvent = (contentWrapHTML) => {
  const passwordChangeButton = contentWrapHTML.querySelector(".change-icon");
  passwordChangeButton.addEventListener("click", appendPasswordChange);
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

const appendPasswordChange = () => {
  // 수정 버튼 삭제
  const chagneButton = document.querySelector(".change-icon");
  if (chagneButton) chagneButton.remove();

  const contentWrapHTML = document.querySelector(".wrapper");
  const passwordChangeEl = document.querySelector(".password-area");
  const tbody = document.createElement("tbody");
  tbody.innerHTML = `
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
  `;
  passwordChangeEl.appendChild(tbody);
};

export default profileWrite;
