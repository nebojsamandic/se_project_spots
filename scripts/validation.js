const showInputError = (formEl, inputEl, errorMsg) => {
    const errorMsgID = inputEl.id + "-error";
    const errorMsgEl = formEl.querySelector("#" + errorMsgID);
    inputEl.classList.add(config.inputErrorClass);
    errorMsgEl.classList.add(config.errorClass);
    errorMsgEl.textContent = errorMsg;
};

const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible"
  };

  const hideInputError = (formEl, inputEl, config) => {
    const errorMsgID = inputEl.id + "-error";
    const errorMsgEl = formEl.querySelector("#" + errorMsgID);
    errorMsgEl.textContent = "";
    inputEl.classList.remove(config.inputErrorClass);
    errorMsgEl.classList.remove(config.errorClass);
};



const checkInputValidity = (formEl, inputEl, config) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, config);
    } else {
        hideInputError(formEl, inputEl, config);
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonEl) => {
    if (hasInvalidInput(inputList)) {
        buttonEl.disabled = true;
        buttonEl.classList.add(settings.inactiveButtonClass);
    } else {
        buttonEl.disabled = false;
        buttonEl.classList.remove(settings.inactiveButtonClass);
    }
   };

const disableButton = (buttonEl) => {
    buttonEl.disabled = true;
};

const setEventListeners = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);

    toggleButtonState(inputList, buttonElement);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formEl, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
};


const resetValidation = (formEl, config) => {

    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);
    inputList.forEach((inputElement) => {
        hideInputError(formEl, inputElement);
    });
    toggleButtonState(inputList, buttonElement);
};

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
        setEventListeners(formEl, config);
    });
};


enableValidation(settings);


  