import './employee.css';
import '@/components/Dropdown/dropdown.css';

import employeeUtils from "./employee";
import { createButton } from "@/components/Button/button";
import { createDropdown } from "@/components/Dropdown/dropdown";
import { createInputField } from "@/components/InputField/input";
import InputValidation from "@/components/InputField/inputValidation";
import { EMPLOYEE_VALIDATION_RULES } from "@/constants/constants";

const BASIC_PROFILE_IMG = '/src/assets/images/profile/profile-basic.png';
let currentProfileImage = '';

const employeeWrite = (container, id) => {
  // 경로 확인(등록/수정 요청 구분)
  const pageType = getPageType();

  // 직원 등록/수정 폼 생성 및 화면에 렌더링
  const contentWrapHTML = createEmployeeWriteForm(pageType, id);
  container.appendChild(contentWrapHTML);

  // 입력 폼 유효성 검사 설정
  new InputValidation(
    contentWrapHTML,
    EMPLOYEE_VALIDATION_RULES,
    handleFormSubmit,
  );
};

const getPageType = () => {
  const typeRegExp = /[^/]+$/;
  const match = window.location.pathname.match(typeRegExp);
  if (match) return match[0];
};

const handleFormSubmit = () => {
  const pageType = getPageType();
  const formData = new FormData(document.querySelector('form'));
  const employees = JSON.parse(localStorage.getItem('employees'));
  const lastEmployee = employees[employees.length - 1];

  let id, employeeNumber, profileImage;

  if (pageType === 'write') {
    const hireDate = new Date(formData.get('hireDate'));
    id = (lastEmployee?.id || 0) * 1 + 1; // 등록된 사원이 없는 경우 1 반환
    employeeNumber = employeeUtils.generateEmployeeNumber(hireDate, id);
    profileImage = currentProfileImage || BASIC_PROFILE_IMG;
  } else {
    const employee = employeeUtils.getEmployeeData(pageType - 1);
    id = employee.id;
    employeeNumber = employee.employeeNumber;
    profileImage = currentProfileImage || employee.profileImage;
  }

  const position = document.querySelector(
    ".position .dropdown_bar p",
  ).textContent;
  const data = {
    id,
    position,
    profileImage,
    employeeNumber,
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    hireDate: formData.get('hireDate'),
    birthDate: formData.get('birthDate'),
    deleteDate: null,
  };

  if (pageType === 'write') {
    employees.push(data);
  } else {
    employees[pageType - 1] = data;
  }

  localStorage.setItem('employees', JSON.stringify(employees)); // 로컬 스토리지 갱신
  window.location.href = `/admin/employee/${pageType === 'write' ? employees.length : pageType}`; //상세페이지로 이동
};

const createEmployeeWriteForm = (type, idx = 0) => {
  let employee = null; // 수정 페이지에 필요한 데이터
  if (idx > 0) {
    employee = employeeUtils.getEmployeeData(idx - 1);
  }

  const contentWrapHTML = document.createElement('div');
  contentWrapHTML.className = 'wrapper';

  // 버튼 생성
  const buttonName = type === "write" ? "등록" : "저장";
  const submitButton = createButton({
    text: buttonName,
    classNames: ["btn--submit"],
  });
  const cancleButton = createButton({
    text: "취소",
    classNames: ["btn--delete"],
  });

  const cancleLink = `/admin/employee${type === "write" ? "" : employee ? "/" + idx : ""}`;
  contentWrapHTML.innerHTML = `
    <div class="header">
      <h2 class="header__title">직원정보 ${type === 'write' ? '등록' : '수정'}</h2>
      <div class="header__btn">
        ${submitButton.outerHTML}
        <a href="${cancleLink}">${cancleButton.outerHTML}</a>
      </div>
    </div>
    <div class="employee-write">
      <form class="wrtie-form">
        <!-- 프로필 사진 영역 -->
        <div class="profile">
          <div class="profile__image" title="프로필 사진">
            <img src="${employee ? employee.profileImage : BASIC_PROFILE_IMG}"></img>
          </div>
          <div class="profile__btn">
            <button class="btn--upload" type="button">사진 설정</button>
            <button class="btn--delete 
                    ${employee && employee.profileImage !== BASIC_PROFILE_IMG ? '' : 'hidden'}" 
                    type="button">사진 삭제</button>
          </div>
          <input type="file" accept=".jpg, .jpeg, .png" name="ptofileImage"/>
        </div>

        <!-- 인사 정보 영역 -->
        <table>
          <colgroup>
            <col width="33%"/>
            <col width="33%"/>
            <col />
          </colgroup>
          <thead>
            <tr>
              <th colspan="3">인사 정보</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
              ${
                createInputField({
                  type: 'text',
                  label: { name: '사번', forAttr: 'employeeNumber' },
                  attributes: {
                    name: 'employeeNumber',
                    id: 'employeeNumber',
                    readonly: 'readonly',
                    placeholder: '자동생성',
                    value: employee ? employee.employeeNumber : '',
                  },
                }).outerHTML
              }
              </td>
              <td>
              ${
                createInputField({
                  type: "date",
                  label: { name: "입사일", forAttr: "hireDate" },
                  attributes: {
                    name: "hireDate",
                    id: "hireDate",
                    value: employee ? employee.hireDate : "",
                  },
                  datasets: { required: true, validation: true },
                }).outerHTML
              }
              </td>
              <td>
                <div class="input-wrap position">
                  <label class="require">직무</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 기본 정보 영역 -->
        <table>
          <colgroup>
            <col width="33%"/>
            <col width="33%"/>
            <col />
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
                  label: { name: "이름", forAttr: "name" },
                  attributes: {
                    name: "name",
                    id: "name",
                    placeholder: "이름을 입력해주세요",
                    value: employee ? employee.name : "",
                  },
                  datasets: { required: true, validation: true },
                }).outerHTML
              }
              </td>
              <td>
              ${
                createInputField({
                  type: "date",
                  label: { name: "생년월일", forAttr: "birthDate" },
                  attributes: {
                    name: "birthDate",
                    id: "birthDate",
                    value: employee ? employee.birthDate : "",
                  },
                  datasets: { required: true, validation: true },
                }).outerHTML
              }
              </td>
              <td>
              ${
                createInputField({
                  label: { name: "연락처", forAttr: "phone" },
                  attributes: {
                    name: "phone",
                    id: "phone",
                    placeholder: "010-0000-0000",
                    value: employee ? employee.phone : "",
                  },
                  datasets: { required: true, validation: true },
                }).outerHTML
              }
              </td>
            </tr>
            <tr>
              <td>
              ${
                createInputField({
                  type: "email",
                  label: { name: "이메일", forAttr: "email" },
                  attributes: {
                    name: "email",
                    id: "email",
                    placeholder: "example@gmail.com",
                    value: employee ? employee.email : "",
                  },
                  datasets: { required: true, validation: true },
                }).outerHTML
              }
              </td>
              <td colspan="4">
              ${
                createInputField({
                  label: { name: "주소", forAttr: "address" },
                  attributes: {
                    name: "address",
                    id: "address",
                    placeholder: "주소를 입력해 주세요",
                    value: employee ? employee.address : "",
                  },
                  datasets: { required: true, validation: true },
                }).outerHTML
              }
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  `;

  appendPositionDropdown(contentWrapHTML, employee); // 직무 드롭다운 추가
  bindProfileImageEvents(contentWrapHTML); // 프로필 사진 관련 이벤트 바인딩

  return contentWrapHTML;
};

const appendPositionDropdown = (contentWrapHTML, employee) => {
  const positionSelect = createDropdown({
    options: [
      '바리스타',
      '고객응대',
      '주방보조',
      '매장관리',
      '결제관리',
      '직원교육',
      '매니저',
    ],
  });
  if (employee) {
    const dropdownBarTextEl = positionSelect.querySelector('.dropdown_bar p');
    dropdownBarTextEl.textContent = employee.position;
  }
  contentWrapHTML.querySelector('.position').appendChild(positionSelect);
};

const bindProfileImageEvents = (contentWrapHTML) => {
  const fileEl = contentWrapHTML.querySelector('.profile input');
  const profileImageEl = contentWrapHTML.querySelector('.profile__image img');
  const profileUploadBtnEl = contentWrapHTML.querySelector(
    ".profile .btn--upload",
  );
  const profileDeleteBtnEl = contentWrapHTML.querySelector(
    ".profile .btn--delete",
  );

  profileUploadBtnEl.addEventListener('click', () => fileEl.click());

  profileDeleteBtnEl.addEventListener('click', () => {
    fileEl.value = '';
    profileImageEl.src = BASIC_PROFILE_IMG;
    profileDeleteBtnEl.classList.add('hidden');
    currentProfileImage = BASIC_PROFILE_IMG;
  });

  fileEl.addEventListener('change', () => {
    if (fileEl.files.length > 0) {
      // 사진 첨부된 상태면 삭제 버튼 노출
      profileDeleteBtnEl.classList.remove('hidden');

      // 프로필 사진 화면에 로드
      const reader = new FileReader();
      reader.onload = (event) => {
        profileImageEl.src = event.target.result;
        currentProfileImage = event.target.result;
      };
      reader.readAsDataURL(fileEl.files[0]);
    } else {
      profileImageEl.src = BASIC_PROFILE_IMG;
      profileDeleteBtnEl.classList.add('hidden');
    }
  });
};

export default employeeWrite;
