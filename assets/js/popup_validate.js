const rest = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__btn',
  inactiveButtonClass: 'popup__btn_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_active',
};

const showError = (form, element, errorMessage, {inputErrorClass, errorClass}) => {
  const errorElement = form.querySelector(`.${element.id}-error`);

  element.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
};

const hideError = (form, element, {inputErrorClass, errorClass}) => {
  const errorElement = form.querySelector(`.${element.id}-error`);

  element.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = '';
};


// Функция, которая проверяет валидность поля. Она принимает formElement и inputElement, а не берёт их из внешней области видимости
const checkInputValidity = (form, element, rest) => {
  if (!element.validity.valid) {
    showError(form, element, element.validationMessage, rest);
  } else {
    hideError(form, element, rest);
  }
};

// Функция принимает массив полей и ищет первое не валидное поле
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Функция принимает массив полей ввода и элемент кнопки, состояние которой нужно менять
const toggleButtonState = (inputList, button, inactiveButtonClass) => {
  if (hasInvalidInput(inputList)) {
    button.classList.add(inactiveButtonClass);
    button.setAttribute('disabled', 'true');
  } else {
    button.classList.remove(inactiveButtonClass);
    button.removeAttribute('disabled');
  }
};


// Слушатель события input
const setEventListeners = (form, {inputSelector, submitButtonSelector, inactiveButtonClass, ...rest}) => {
  const inputList = Array.from(form.querySelectorAll(inputSelector));
  const button = form.querySelector(submitButtonSelector);

  toggleButtonState(inputList, button, inactiveButtonClass);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(form, inputElement, rest);
      toggleButtonState(inputList, button, inactiveButtonClass);
    });
  });
};


const enableValidation = ({formSelector, ...rest}) => {
  const formList = Array.from(document.querySelectorAll(formSelector));

  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, rest);
  });
};

enableValidation(rest);






