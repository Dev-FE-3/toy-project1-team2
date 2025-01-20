import "./write.css";

import { createButton } from "@/components/Button/button.js";
import { createInputField } from "@/components/InputField/input.js";
import Modal from "@/components/Modal/modal.js";

const write = (contents) => {
  const submitButton = createButton("등록", handleRegister, ["btn--submit"]);

  const titleField = createInputField({
    type: "text",
    attributes: {
      name: "input",
      id: "title",
      placeholder: "제목을 입력하세요",
    },

    datasets: { required: true, validation: true },
  });

  const contentField = createInputField({
    tagName: "textarea",
    attributes: {
      name: "content",
      id: "content",
      classList: ["border--main", "class2"],
      placeholder: "내용을 입력하세요",
      rows: "10",
    },
    datasets: { required: true, validation: true },
  });

  const fileField = createInputField({
    type: "file",
    attributes: {
      name: "file",
      id: "file",
      classList: ["border--main", "class2", "fileField"],
      multiple: "multiple",
    },
    datasets: { required: false, validation: true },
  });

  contents.innerHTML = `
    <section class="wrapper">
        <header class="write-header">
            <h1>공지사항 등록</h1>
            <div class="button"></div> <!-- 버튼을 여기에 추가할 예정 -->
        </header>
        <section class="field">
            ${titleField.outerHTML}

            <div class="fileField"></div>
           <div class="contentField"></div>
            ${contentField.outerHTML}
        </section>
    </section>
  `;

  // 등록 버튼을 DOM에 직접 추가
  const buttonContainer = contents.querySelector(".button");
  buttonContainer.appendChild(submitButton);

  const fileFieldContainer = contents.querySelector(".fileField");
  fileFieldContainer.appendChild(fileField);

  function handleRegister() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const fileInput = document.getElementById("file");
    const files = fileInput.files;

    if (!title) {
      const modal = Modal({
        title: "안내", //제목
        message: "제목을 입력해 주세요", //메세지
        modalStyle: "warning",
        onConfirm: () => {},
        showCancelBtn: false, // 취소 버튼 출력 여부
      });

      document.body.appendChild(modal); // 모달을 DOM에 추가
      modal.querySelector(".modal").classList.remove("hidden"); // 모달 열기
      return;
    }

    if (!content) {
      const modal = Modal({
        title: "안내", //제목
        message: "내용을 입력해 주세요", //메세지
        modalStyle: "warning",
        onConfirm: () => {},
        showCancelBtn: false, // 취소 버튼 출력 여부
      });

      document.body.appendChild(modal); // 모달을 DOM에 추가
      modal.querySelector(".modal").classList.remove("hidden"); // 모달 열기
      return;
    }

    if (content.length < 10) {
      const modal = Modal({
        title: "안내", //제목
        message: "내용은 최소 10자 이상 입력해야 합니다.", //메세지
        modalStyle: "warning",
        onConfirm: () => {},
        showCancelBtn: false, // 취소 버튼 출력 여부
      });

      document.body.appendChild(modal); // 모달을 DOM에 추가
      modal.querySelector(".modal").classList.remove("hidden"); // 모달 열기
      return;
    }

    const fileList = Array.from(files).map((file) => file.name);

    alert("공지사항이 등록되었습니다.");

    // 입력 필드 초기화
    document.getElementById("title-input").value = "";
    document.getElementById("content").value = "";
    fileInput.value = "";
  }
};

export default write;
