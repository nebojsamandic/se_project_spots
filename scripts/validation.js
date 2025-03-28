const showInputError = (formEl, inputEl, errorMsg) => {
    const errorMsgID = inputEl.id + "-error";
    const errorMsgEl = formEl.querySelector("#" + errorMsgID);
    errorMsgEl.textContent = errorMsg;

};

const hideInputError = (formEl, inputEl) => {
    const errorMsgID = inputEl.id + "-error";
    const errorMsgEl = formEl.querySelector("#" + errorMsgID);
    errorMsgEl.textContent = "";

};

const checkInputValidity = (formEl, inputEl) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage);
    } else {
        hideInputError(formEl, inputEl);
    }
};

const setEventListeners = (formEl) => {
    const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
    const buttonElement = formEl.querySelector(".modal__button");

   // toogleButtonState(inputList, buttonElement)

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formEl, inputElement);
            // toogleButtonState(inputList, buttonElement);
        });
    });
};



const enableValidation = () => {
    const formList = document.querySelectorAll(".modal__form");
    formList.forEach((formEl) => {
        setEventListeners(formEl);
    });
}


enableValidation();