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

    document.body.appendChild(modal.modalHTML);
    modal.openModal();
  }

  contents.innerHTML = `
    <section class="wrapper">
        <header class="header">
            <h1 class="header__title">공지사항 등록</h1>
            <div class="button"></div> <!-- 버튼을 여기에 추가할 예정 -->
        </header>
        <section class="field-contents">
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
    const contents = document.getElementById("content").value;
    const fileInput = document.getElementById("file");
    const files = fileInput.files;

    if (!title || !contents || contents.length < 10) {
      const message = !title
        ? "제목을 입력해 주세요"
        : !contents
          ? "내용을 입력해 주세요"
          : "내용은 최소 10자 이상 입력해야 합니다.";

      showModal(message, "warning");
      return;
    }

    // 파일 유효성 검사
    const maxFileSize = 3 * 1024 * 1024; // 5MB
    const allowedFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]; // JPG, PNG, GIF, PDF, DOCX
    const maxFileCount = 3;

    if (files.length > maxFileCount) {
      showModal("첨부파일은 최대 3개까지만 업로드 가능합니다.", "warning");
      return;
    }

    for (const file of files) {
      if (!allowedFileTypes.includes(file.type)) {
        console.log(`파일 형식 ${file.type}는 허용되지 않습니다.`);
        showModal(
          "JPG, PNG, GIF, PDF, DOCX 형식의 파일만 업로드 가능합니다.",
          "warning"
        );
        return;
      }

      if (file.size > maxFileSize) {
        showModal(
          "첨부파일은 파일당 최대 3MB까지 업로드 가능합니다.",
          "warning"
        );
        return;
      }
    }

    // 파일 목록을 Base64로 변환
    const filePromises = Array.from(files).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ name: file.name, src: reader.result });
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        })
    );

    let notices = JSON.parse(localStorage.getItem("notices")) || [];

    // 새로운 데이터의 id는 1로 설정
    const newNoticeId = 1;

    // 기존 데이터의 id를 모두 +1 (밀어냄)
    notices = notices.map((notice) => ({
      ...notice,
      id: notice.id + 1,
    }));

    Promise.all(filePromises)
      .then((fileList) => {
        const noticeData = {
          id: newNoticeId,
          date: new Date().toISOString(),
          title,
          contents,
          imgSrc: fileList.length > 0 ? fileList : null,
        };

        // 로컬 스토리지에 공지 저장
        try {
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
      })
      .catch((error) => {
        console.error("파일 변환 중 오류 발생:", error);
        showModal("파일 처리 중 오류가 발생했습니다.", "warning");
      });
  }
};

export default write;
