import './detail.css';

import { createButton } from '@/components/Button/button.js';
import Modal from '@/components/Modal/modal.js';

const detail = (contents) => {
  // const submitButton = createButton("수정", null, ["btn--submit"]);
  const deleteButton = createButton(
    '삭제',
    () => showModal('정말로 삭제하시겠습니까?', 'warning', handlePerformDelete),
    ['btn--delete'],
  );

  const pathname = window.location.pathname; // "/notice/detail/1"
  const noticeId = pathname.split('/')[3]; // "1"

  // 로컬 스토리지 또는 API를 통해 공지사항 데이터 가져오기
  const noticesData = JSON.parse(localStorage.getItem('notices')) || [];
  const notice = noticesData.find((item) => item.id === Number(noticeId));

  const referrer = document.referrer; // 이전 URL 확인

  function showModal(
    message,
    style,
    onConfirm = () => {},
    showCancelBtn = true,
  ) {
    const modal = Modal({
      title: '안내',
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
             <h1 class="header__title">공지사항 상세</h1>
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

  // 이전 URL이 "admin/notice"인 경우 수정/삭제 버튼 추가
  if (referrer.includes('/admin/notice')) {
    const buttonContainer = contents.querySelector('.action-buttons');
    buttonContainer.appendChild(deleteButton);
  }

  function handlePerformDelete() {
    const updatedNoticesData = noticesData.filter(
      (item) => item.id !== Number(noticeId),
    );

    // 로컬 스토리지에 삭제된 공지사항 목록 저장
    localStorage.setItem('notices', JSON.stringify(updatedNoticesData));

    showModal(
      '삭제가 완료되었습니다.',
      'success',
      () => (window.location.href = '/admin/notice'),
    );
  }
};

export default detail;
