export default class InputValidation {
  #form;
  #validationRules;
  #submit;

  constructor(selector, validationRules, submitFunc) {
    this.#form = document.querySelector(selector);
    this.#validationRules = validationRules;
    this.#submit = submitFunc;

    this.#initEvent();
  }

  #initEvent() {
    const inputEls = this.#form.querySelectorAll('input,textarea');
    const btnSubmit = this.#form.querySelector('.btn__submit');
    btnSubmit.addEventListener('click', (event) => {
      event.preventDefault();

      // 유효성 검증
      let isValid = true; // 유효성 검사 결과를 저장할 변수
      for (const inputEl of inputEls) {
        if (this.#checkRequired(inputEl) === false) isValid = false;
        if (inputEl.type === 'password') isValid = this.#checkPasswordMatch() && isValid;
      }

      // 데이터 저장
      if (isValid) this.#submit();
    });

    // 입력창 input 이벤트
    inputEls.forEach((inputEl) => {
      inputEl.addEventListener('input', () => {
        this.#checkRequired(inputEl);
        this.#checkValidation(inputEl);
        if (inputEl.type === 'password') this.#checkPasswordMatch();
      });
    });
  }

  #checkRequired(inputEl) {
    if (inputEl.dataset.required === 'true') {
      const inputGroupEl = inputEl.closest('.input-group');
      const invalidMessageEl = inputGroupEl.querySelector('.invalid-message');

      if (this.#isEmpty(inputEl.value)) {
        this.#setInvalidMessage(inputGroupEl, invalidMessageEl, 'required', inputEl);
        return false;
      } else {
        this.#removeInvalidMessage(invalidMessageEl, inputEl);
        return true;
      }
    }
  }

  #checkValidation(inputEl) {
    if (inputEl.dataset.validation === 'true') {
      const inputGroupEl = inputEl.closest('.input-group');
      const invalidMessageEl = inputGroupEl.querySelector('.invalid-message');
      
      const regExp = this.#validationRules[inputEl.name].regExp;
      if (!this.#isValid(inputEl.value, regExp)) {
        this.#setInvalidMessage(inputGroupEl, invalidMessageEl, inputEl.name, inputEl);
      } else {
        this.#removeInvalidMessage(invalidMessageEl, inputEl);
      }
    }
  }

  #isValid(value, regExp) {
    return new RegExp(regExp).test(value);
  }

  #isEmpty(value) {
    return value === null || value === '';
  }
  
  #checkPasswordMatch() {
    const passwordEl = this.#form.querySelector('input[name="password"]');
    const confirmPasswordEl = this.#form.querySelector('input[name="confirmPassword"]');
    
    if (passwordEl && confirmPasswordEl && confirmPasswordEl.value !== '') {
      const inputGroup = confirmPasswordEl.closest('.input-group');
      const invalidMessageEl = inputGroup.querySelector('.invalid-message');

      if (passwordEl.value !== confirmPasswordEl.value) {
        this.#setInvalidMessage(inputGroup, invalidMessageEl, 'passwordMismatch', confirmPasswordEl);
        return false;
      } else {
        this.#removeInvalidMessage(invalidMessageEl, confirmPasswordEl);
        return true;
      }
    }
    return true;
  }

  #createInvalidMessageEl(type) {
    const el = document.createElement('p');
    el.classList.add('invalid-message');
    el.textContent = this.#validationRules[type].message;
    return el;
  }

  #setInvalidMessage(inputGroupEl, invalidMessageEl, type, inputEl) {
    if (invalidMessageEl) invalidMessageEl.remove();
    inputGroupEl.append(this.#createInvalidMessageEl(type));
    inputEl.classList.add('invalid');
  }

  #removeInvalidMessage(invalidMessageEl, inputEl) {
    if (invalidMessageEl) invalidMessageEl.remove();
    inputEl.classList.remove('invalid');
  }
}