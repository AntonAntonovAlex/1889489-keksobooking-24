import { LAT_TOKIO, LNG_TOKIO, MAX_PRICE, MinHousingPrice, ANNOUNCEMENTS_NUMBER } from './constants.js';
import { fetchData } from './api.js';
import { isEscapeKey } from './utils.js';
import { mainPinMarker, map, createMarkers, similarAnnouncements } from './map.js';

const PRICE_ANNOUNCEMENT_DEFAULT= '1000';
const PREVIEW_IMAGE_DEFAULT = 'img/muffin-grey.svg';
const URL = 'https://24.javascript.pages.academy/keksobooking';
const allFormElements = document.querySelectorAll('.ad-form__element');
const formAnnouncement = document.querySelector('.ad-form');
const headerFormAnnouncement =  document.querySelector('.ad-form-header');
const priceAnnouncement =  document.querySelector('#price');
const roomNumberAnnouncement =  document.querySelector('#room_number');
const capacityRoomAnnouncement =  document.querySelector('#capacity');
const timeinAnnouncement =  document.querySelector('#timein');
const timeoutAnnouncement =  document.querySelector('#timeout');
const typeBuildingAnnouncement =  document.querySelector('#type');
const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');
const resetButton = document.querySelector('.ad-form__reset');
const preview = document.querySelector('.ad-form-header__preview').querySelector('img');
const previewHousingContainer = document.querySelector('.ad-form__photo');
const mapFilter = document.querySelector('.map__filters');
const addressAnnouncement =  document.querySelector('#address');

priceAnnouncement.addEventListener('input', () => {
  const valuePrice = priceAnnouncement.value;
  if (valuePrice > MAX_PRICE) {
    priceAnnouncement.setCustomValidity('Цена не должна превышать 1 000 000');
  } else {
    priceAnnouncement.setCustomValidity('');
  }
  priceAnnouncement.reportValidity();
});

const compareCapacityRoom = (roomNumber, capacityRoom) => {
  const invalidText = 'Не подхoдит для выбранного кол-ва комнат';
  roomNumber = Number(roomNumber);
  capacityRoom = Number(capacityRoom);
  let validityText = '';
  if (capacityRoom === 0) {
    if (roomNumber !== 100) {
      validityText = invalidText;
    }
  } else if (roomNumber !== capacityRoom && roomNumber-1 !== capacityRoom && roomNumber-2 !== capacityRoom) {
    validityText = invalidText;
  }
  capacityRoomAnnouncement.setCustomValidity(validityText);
};

roomNumberAnnouncement.addEventListener('change', () => {
  compareCapacityRoom(roomNumberAnnouncement.value, capacityRoomAnnouncement.value);
  capacityRoomAnnouncement.reportValidity();
});

capacityRoomAnnouncement.addEventListener('change', () => {
  compareCapacityRoom(roomNumberAnnouncement.value, capacityRoomAnnouncement.value);
  capacityRoomAnnouncement.reportValidity();
});

timeinAnnouncement.addEventListener('change', () => {
  timeoutAnnouncement.value = timeinAnnouncement.value;
});

timeoutAnnouncement.addEventListener('change', () => {
  timeinAnnouncement.value = timeoutAnnouncement.value;
});

typeBuildingAnnouncement.addEventListener('change', () => {
  priceAnnouncement.min = MinHousingPrice[typeBuildingAnnouncement.value.toUpperCase()];
  priceAnnouncement.placeholder = MinHousingPrice[typeBuildingAnnouncement.value.toUpperCase()];
  priceAnnouncement.reportValidity();
});

const clearForm = () => {
  formAnnouncement.reset();
  mapFilter.reset();
  map.closePopup();
  priceAnnouncement.placeholder = PRICE_ANNOUNCEMENT_DEFAULT;
  priceAnnouncement.min = PRICE_ANNOUNCEMENT_DEFAULT;
  capacityRoomAnnouncement.setCustomValidity('');
  mainPinMarker.setLatLng({lat: LAT_TOKIO, lng: LNG_TOKIO});
  addressAnnouncement.value = `${mainPinMarker.getLatLng().lat}, ${mainPinMarker.getLatLng().lng}`;
  preview.src = PREVIEW_IMAGE_DEFAULT;
  if (previewHousingContainer.firstChild) {
    previewHousingContainer.firstChild.remove();
  }
};

const removeSuccessElement = (element, onMessageEscClick, onMessageClick) => {
  element.remove();
  document.removeEventListener('keydown', onMessageEscClick);
  document.removeEventListener('click', onMessageClick);
};

const showMessage = (element) => {
  document.body.append(element);

  const onMessageClick = (evt) => {
    if (evt.type === 'click') {
      removeSuccessElement(element, onMessageEscClick, onMessageClick);
    }
  };

  function onMessageEscClick(evt) {
    if (isEscapeKey(evt)) {
      removeSuccessElement(element, onMessageEscClick, onMessageClick);
    }
  }
  document.addEventListener ('click', onMessageClick);
  document.addEventListener ('keydown', onMessageEscClick);
};

const onSuccess = () => {
  clearForm();
  const successElement = successTemplate.cloneNode(true);
  showMessage(successElement);
};

const onError = () => {
  const errorElement = errorTemplate.cloneNode(true);
  showMessage(errorElement);
};

formAnnouncement.addEventListener ('submit', (evt) => {
  evt.preventDefault();
  fetchData(URL, 'POST', onSuccess, onError, new FormData(evt.target));
  createMarkers(similarAnnouncements.slice(0, ANNOUNCEMENTS_NUMBER));
});

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  clearForm();
  createMarkers(similarAnnouncements.slice(0, ANNOUNCEMENTS_NUMBER));
});

const disableForm = () =>{
  formAnnouncement.classList.add('ad-form--disabled');
  headerFormAnnouncement.setAttribute('disabled', 'disabled');

  allFormElements.forEach((formElement) => {
    formElement.setAttribute('disabled', 'disabled');
  });
};

const enableForm = () => {
  formAnnouncement.classList.remove('ad-form--disabled');
  headerFormAnnouncement.removeAttribute('disabled');

  allFormElements.forEach((formElement) => {
    formElement.removeAttribute('disabled');
  });
};

export {disableForm, enableForm};
