import "./employee.css";
import "@/components/Dropdown/style.css";

import { createInputField } from "@/components/InputField/input";
import { createDropdown } from "@/components/Dropdown/dropdown";
import InputValidation from "@/components/InputField/inputValidation";

const BASIC_PROFILE_IMG = "/src/assets/images/profile/profile-basic.png";
let userUploadFile = "";

const employeeWrite = (container, id) => {
  // 경로 확인
  const pageType = getPageType();

  // 직원 등록/수정 폼 작성
  const contentWrapHTML = document.createElement("div");
  contentWrapHTML.className = "content-wrap";
  createEmployeeWriteForm(contentWrapHTML, pageType, id);

  container.appendChild(contentWrapHTML); // 화면에 렌더링

  // 입력 폼 유효성 검사 설정
  const validationRules = {
    name: {
      regExp: /^.{0,50}$/,
      message: "50자 이내로 입력해주세요",
    },
    address: {
      regExp: /^.{0,100}$/,
      message: "100자 이내로 입력해주세요",
    },
    hireDate: {
      regExp: /^\d{4}-\d{2}-\d{2}$/,
      message: "유효한 날짜를 입력해 주세요",
    },
    birthDate: {
      regExp: /^\d{4}-\d{2}-\d{2}$/,
      message: "유효한 날짜를 입력해 주세요",
    },
    phone: {
      regExp: /^(01[0-9])-(\d{3,4})-(\d{4})$/,
      message: "유효한 연락처를 입력해 주세요",
    },
    email: {
      regExp: /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "유효한 이메일을 입력해 주세요",
    },
    required: {
      message: "필수 입력 항목입니다",
    },
  };
  new InputValidation(contentWrapHTML, validationRules, formSubmit);
};

const formSubmit = () => {
  const pageType = getPageType();

  //등록 로직 작성
  const formData = new FormData(document.querySelector("form"));
  const employees = JSON.parse(localStorage.getItem("employees")).employees;
  const lastEmployee = employees[employees.length - 1];

  let id = null;
  let employeeNumber = "";
  let profileImage = null;

  if (pageType === "write") {
    id = lastEmployee.id * 1 + 1;

    const hireDate = new Date(formData.get("hireDate"));
    employeeNumber += hireDate.getFullYear().toString().slice(-2);
    employeeNumber += (hireDate.getMonth() + 1).toString().padStart(2, "0");
    employeeNumber += hireDate.getDate().toString().padStart(2, "0");
    employeeNumber += (lastEmployee.id * 1 + 1).toString().padStart(3, "0");

    profileImage = userUploadFile === "" ? BASIC_PROFILE_IMG : userUploadFile;
  } else {
    const employeeData = getEmployeeData(pageType - 1);

    id = employeeData.id;
    employeeNumber = employeeData.employeeNumber;
    profileImage =
      userUploadFile === "" ? employeeData.profileImage : userUploadFile;
  }

  const data = {
    id: id,
    employeeNumber: employeeNumber,
    name: formData.get("name"),
    birthDate: formData.get("birthDate").replaceAll("-", "."),
    position: document.querySelector(".position .dropdown_bar p").textContent,
    hireDate: formData.get("hireDate").replaceAll("-", "."),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    deleteDate: null,
    profileImage: profileImage,
  };

  if (pageType === "write") {
    employees.push(data);
  } else {
    employees[pageType - 1] = data;
  }

  localStorage.setItem("employees", JSON.stringify({ employees })); // 로컬 스토리지 갱신
  window.location.href = `/admin/employee/${pageType === "write" ? employees.length : pageType}`; //상세페이지로 이동
};

const getEmployeeData = (idx) => {
  const jsonData = JSON.parse(localStorage.getItem("employees"));
  if (idx > -1 && idx <= jsonData.employees.length - 1) {
    return jsonData.employees[idx];
  } else {
    window.location.href = "/admin/employee";
  }
};

const getPageType = () => {
  const typeRegExp = /[^/]+$/;
  const match = window.location.pathname.match(typeRegExp);
  if (match) return match[0];
};

const createEmployeeWriteForm = (contentWrapHTML, type, empId = 0) => {
  let employeeData = null;
  if (empId > 0) {
    employeeData = getEmployeeData(empId - 1);
  }

  contentWrapHTML.innerHTML = `
    <div class="header">
      <h2 class="header__title">직원정보 ${type === "write" ? "등록" : "수정"}</h2>
      <div class="header__btn">
        <button class="btn btn--submit" type="button">${type === "write" ? "등록" : "저장"}</button>
        ${
          type === "write"
            ? `<a href="/admin/employee">
            <button class="btn btn--delete" type="button">취소</button>
          </a>`
            : `<a href="/admin/employee${employeeData ? "/" + empId : ""}">
            <button class="btn btn--delete" type="button">취소</button>
          </a>`
        }
      </div>
    </div>
    <div class="employee-write">
      <form class="wrtie-form">
        <!-- 프로필 사진 영역 -->
        <div class="profile">
          <div class="profile__image" title="프로필 사진">
            <img src="${employeeData ? employeeData.profileImage : BASIC_PROFILE_IMG}"></img>
          </div>
          <div class="profile__btn">
            <button class="btn--upload" type="button">사진 설정</button>
            ${
              employeeData && employeeData.profileImage !== BASIC_PROFILE_IMG
                ? `<button class="btn--delete" type="button">사진 삭제</button>`
                : `<button class="btn--delete hidden" type="button">사진 삭제</button>`
            }
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
                    type: "text",
                    label: { name: "사번", forAttr: "employeeNumber" },
                    attributes: {
                      name: "employeeNumber",
                      id: "employeeNumber",
                      readonly: "readonly",
                      placeholder: "자동생성",
                      value: employeeData ? employeeData.employeeNumber : "",
                    },
                  }).outerHTML
                }
              </td>
              <td>
                ${
                  createInputField({
                    type: "date",
                    label: {
                      name: "입사일",
                      forAttr: "hireDate",
                      required: true,
                    },
                    attributes: {
                      name: "hireDate",
                      id: "hireDate",
                      value: employeeData
                        ? employeeData.hireDate.replaceAll(".", "-")
                        : "",
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
                      placeholder: "이름을 입력해 주세요",
                      value: employeeData ? employeeData.name : "",
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
                      value: employeeData
                        ? employeeData.birthDate.replaceAll(".", "-")
                        : "",
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
                      value: employeeData ? employeeData.phone : "",
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
                      value: employeeData ? employeeData.email : "",
                    },
                    datasets: { required: false, validation: true },
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
                      value: employeeData ? employeeData.address : "",
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

  // 직무 드롭다운 추가
  const positionSelect = createDropdown({
    options: [
      "바리스타",
      "고객응대",
      "주방보조",
      "매장관리",
      "결제관리",
      "직원교육",
    ],
  });
  contentWrapHTML.querySelector(".position").appendChild(positionSelect);
  if (employeeData) {
    const dropdownBarTextEl = positionSelect.querySelector(".dropdown_bar p");
    dropdownBarTextEl.textContent = employeeData.position;
  }

  // 이벤트 바인딩
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
    userUploadFile = BASIC_PROFILE_IMG;
  });

  fileEl.addEventListener("change", () => {
    if (fileEl.files.length > 0) {
      // 사진 첨부된 상태면 삭제 버튼 노출
      if (profileDeleteBtnEl.classList.contains("hidden")) {
        profileDeleteBtnEl.classList.remove("hidden");
      }

      // 프로필 사진 화면에 로드
      const reader = new FileReader();
      reader.onload = (event) => {
        profileImageEl.src = event.target.result;
        userUploadFile = event.target.result;
      };
      reader.readAsDataURL(fileEl.files[0]);
    } else {
      profileImageEl.src = BASIC_PROFILE_IMG;
      profileDeleteBtnEl.classList.add("hidden");
    }
  });
};

export default employeeWrite;
