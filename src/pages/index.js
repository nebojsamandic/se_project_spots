import { enableValidation } from '../scripts/validation.js';
import Api from '../utils/api.js';
import './index.css';

let selectedCard = null;
let selectedCardId = null;


const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible"
};

enableValidation(settings);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "5616af4c-c51d-42a4-ba5f-a96c6074c9ed",
    "Content-Type": "application/json"
  }
});

api.getAppInfo()
  .then(([userData, cards]) => {
    // 👤 Set user info in profile UI
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    document.querySelector(".profile__avatar").src = userData.avatar;

    // 🖼️ Render each card
    cards.forEach((item) => renderCard(item));
  })
  .catch((err) => {
    console.error("Error loading app info:", err);
  });


const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseButtons = avatarModal.querySelectorAll('.modal__close-btn');
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarForm = avatarModal.querySelector(".modal__form");



function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value;

  api.editUserAvatar({ avatar: avatarUrl })
    .then((updatedUser) => {
      document.querySelector(".profile__avatar").src = updatedUser.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    });
}


const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const closeButtons = document.querySelectorAll('.modal__close');
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = document.querySelector(".modal__image");
const previewModalCaptionEl = document.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");
const deleteForm = document.querySelector("#delete-form");
const deleteModal = document.querySelector("#delete-modal");

const errorMessages = Array.from(cardForm.querySelectorAll('.modal__error'));


function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  cardSubmitBtn.textContent = "Saving...";

  api.addCard({ name, link })
    .then((newCard) => {
      renderCard(newCard);
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error("Failed to add card:", err);
    })
    .finally(() => {
      cardSubmitBtn.textContent = "Save";
    });
}



function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true).querySelector(".card");

  const cardNameEl = cardElement.querySelector(".card__title");
  cardNameEl.textContent = data.name;

  const cardImageEl = cardElement.querySelector(".card__image");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
    const request = isLiked
      ? api.unlikeCard(data._id)
      : api.likeCard(data._id);

    request
      .then((updatedCard) => {
        if (updatedCard.likes && updatedCard.likes.length > 0) {
          cardLikeBtn.classList.add("card__like-btn_liked");
        } else {
          cardLikeBtn.classList.remove("card__like-btn_liked");
        }
      })
      .catch((err) => {
        console.error("Failed to toggle like:", err);
      });
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  const cardDeleteEl = cardElement.querySelector(".card__delete");
  cardDeleteEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}


function handleDeleteSubmit(evt) {
  evt.preventDefault();

  if (!selectedCardId || !selectedCard) return;

  api.removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch((err) => {
      console.error("Failed to delete card:", err);
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);


function fillProfileForm() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.modal_opened');
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}


function openModal(modal) {
  modal.classList.add('modal_opened');
  document.addEventListener('keydown', handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove('modal_opened');
  document.removeEventListener('keydown', handleEscClose);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const newName = editModalNameInput.value;
  const newAbout = editModalDescriptionInput.value;

  api.editUserInfo({ name: newName, about: newAbout })
    .then((updatedUser) => {
      profileName.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error("Failed to update profile:", err);
    });
}

profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  resetValidation(editFormElement, settings);
  openModal(editModal);
});

 closeButtons.forEach((button) => {
    const popup = button.closest('.modal');
    button.addEventListener('click', () => closeModal(popup));
  });

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarCloseButtons.forEach((button) => {
  const popup = button.closest('.modal');
  button.addEventListener('click', () => closeModal(popup));
});


avatarForm.addEventListener("submit", handleAvatarSubmit);


editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);


function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardList[ method ](cardElement);
}

const modals = document.querySelectorAll('.modal');

modals.forEach((modal) => {
  modal.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('modal')) {
      closeModal(modal);
    }
  });
});
