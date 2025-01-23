import "./common.css";
import "./detail.css";

import { createButton } from "@/components/Button/button.js";
import Modal from "@/components/Modal/modal.js";

const detail = (contents) => {
  const submitButton = createButton("수정", null, ["btn--submit"]);
  const deleteButton = createButton("삭제", null, ["btn--delete"]);

  const pathname = window.location.pathname; // "/notice/detail/1"

  const parts = pathname.split("/"); // ["", "notice", "detail", "1"]
  const noticeId = parts[3]; // "1"
  console.log(pathname, parts, noticeId);

  // 로컬 스토리지 또는 API를 통해 공지사항 데이터 가져오기
  const noticesData = JSON.parse(localStorage.getItem("notices")) || [];
  const notice = noticesData.find((item) => item.id === Number(noticeId));

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
        <header class="header">
            <h1>공지사항 상세</h1>
            <div class="action-buttons">
              <!-- 버튼을 여기에 추가할 예정 -->
            </div> 
        </header>
        <section class="detail-contents">
          <div class="title">${notice.title}</div>
          <div class="contents">${notice.contents}</div>
        </section>
    </section>
  `;
};

export default detail;
