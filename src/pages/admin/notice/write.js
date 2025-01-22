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

  function showModal(
    message,
    style,
    onConfirm = () => {},
    showCancelBtn = false
  ) {
    const modal = Modal({
      title: "안내",
      message,
      modalStyle: style,
      onConfirm,
      showCancelBtn,
    });

    document.body.appendChild(modal);
    modal.querySelector(".modal").classList.remove("hidden");
  }

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

    if (!title || !content || content.length < 10) {
      const message = !title
        ? "제목을 입력해 주세요"
        : !content
          ? "내용을 입력해 주세요"
          : "내용은 최소 10자 이상 입력해야 합니다.";

      showModal(message, "warning");
      return;
    }

    const fileList = Array.from(files).map((file) => file.name);

    const noticeData = {
      date: new Date().toISOString(),
      title,
      content,
      files: fileList || [],
    };

    try {
      let notices = JSON.parse(localStorage.getItem("notices")) || [];
      notices.unshift(noticeData);
      localStorage.setItem("notices", JSON.stringify(notices));

      showModal(
        "공지사항이 등록되었습니다.",
        "check",
        () => {
          window.location.href = "/admin/notice";

          // 입력 필드 초기화
          document.getElementById("title").value = "";
          document.getElementById("content").value = "";
          fileInput.value = "";
        },
        false
      );
    } catch (error) {
      showModal("공지사항 등록 중 오류가 발생했습니다.", "warning");
    }
  }
};

export default write;
