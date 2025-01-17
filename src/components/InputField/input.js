import './style.css';

// 속성 설정
function setAttributes(attributes, element) {
  for (const key in attributes) {
    if (key === 'classList') {
      if (attributes[key].length > 0) {
        element.classList.add(...attributes[key]);
      }
    } else {
      if (attributes[key] !== null) element.setAttribute(key, attributes[key]);
    }
  }
}

// dataset 설정
function setDatasets(datasets, element) {
  for (const key in datasets) {
    element.dataset[key] = datasets[key];
  }
}

// 입력요소 THML 생성 및 이벤트 바인딩
export const createInputField = ({ 
  tagName = 'input',
  type = null, 
  label = {name: null, forAttr: null}, 
  attributes = {
    name: null, 
    id: null, 
    classList: [], 
    placeholder: null, 
  },
  datasets = {
    required: 'false',
    validation: 'false'
  }
} = {}) => {

  // 컨테이너 요소 생성
  const inputWrapEl = document.createElement('div');
  inputWrapEl.className = 'input-wrap';

  // 라벨 요소 생성
  if (label.name !== null) {
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', label.forAttr);
    labelEl.textContent = label.name;
    inputWrapEl.appendChild(labelEl);
  }

  // 입력 그룹 생성
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';

  // 입력 요소 생성
  const inputEl = document.createElement(tagName);
  if (type !== null) {
    if (type === 'search') {
      const searchEl = document.createElement('div');
      searchEl.className = 'search'; // 커스텀 디자인 위함

      inputEl.type = type;
      inputEl.classList.add('search__input');
      setAttributes(attributes, inputEl);
      setDatasets(datasets, inputEl);

      const searchBtnEl = document.createElement('img');
      searchBtnEl.setAttribute('src', '/src/assets/icons/search.svg');
      searchBtnEl.setAttribute('alt', '검색 아이콘');
      searchBtnEl.classList.add('btn', 'search__btn');

      searchEl.appendChild(inputEl);
      searchEl.appendChild(searchBtnEl);
      inputGroup.appendChild(searchEl);
    } else if (type === 'file') {
      const fileEl = document.createElement('div');
      fileEl.className = 'file'; // 커스텀 디자인 위함

      inputEl.type = type;
      inputEl.classList.add('file__input');
      setAttributes(attributes, inputEl);
      setDatasets(datasets, inputEl);

      const fileTextEl = document.createElement('span');
      fileTextEl.className = 'file__text';
      fileTextEl.textContent = attributes['placeholder'] || '파일 선택';

      const fileBtnEl = document.createElement('img');
      fileBtnEl.setAttribute('src', '/src/assets/icons/file.svg');
      fileBtnEl.setAttribute('alt', '파일 첨부 아이콘');
      fileBtnEl.classList.add('btn', 'file__btn');

      fileEl.appendChild(inputEl);
      fileEl.appendChild(fileTextEl);
      fileEl.appendChild(fileBtnEl);
      inputGroup.appendChild(fileEl);

      // 파일 선택 이벤트 설정
      fileEl.addEventListener('click', () => {
        inputEl.click();
      })
      // 파일 첨부 이벤트 설정
      inputEl.addEventListener('change', () => {
        const files = inputEl.files;
        
        if (files.length > 0) {
          fileTextEl.classList.add('attached');
          fileTextEl.textContent = files.length === 1 ? files[0].name : `${files[0].name} 외 ${files.length - 1}건`;
        } else {
          fileTextEl.classList.remove('attached');
          fileTextEl.textContent = '파일 선택';
        }
      })

    } else {
      inputEl.type = type;
      setAttributes(attributes, inputEl);
      setDatasets(datasets, inputEl);
      inputGroup.appendChild(inputEl);
    }
  } else {
    setAttributes(attributes, inputEl);
    setDatasets(datasets, inputEl);
    inputGroup.appendChild(inputEl);
  }

  inputWrapEl.appendChild(inputGroup);
  
  return inputWrapEl;
}