import { MAX_PRICE, MIN_HOUSING_PRICES } from './constants.js';
import { fetchData } from './api.js';
import { isEscapeKey } from './util.js';
import { LAT_TOKIO, LNG_TOKIO, mainPinMarker, addressAnnouncement, map, mapFilter, createMarkers, similarAnnouncements, ANNOUNCEMENTS_NUMBER } from './map.js';
import { preview, previewHousingContainer } from './avatar.js';

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

const disableForm = () => {
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

priceAnnouncement.addEventListener('input', () => {
  const valuePrice = priceAnnouncement.value;
  if (valuePrice > MAX_PRICE) {
    priceAnnouncement.setCustomValidity('Цена не должна превышать 1 000 000');
  } else {
    priceAnnouncement.setCustomValidity('');
  }
  priceAnnouncement.reportValidity();
});

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
  priceAnnouncement.min = MIN_HOUSING_PRICES[typeBuildingAnnouncement.value];
  priceAnnouncement.placeholder = MIN_HOUSING_PRICES[typeBuildingAnnouncement.value];
  priceAnnouncement.reportValidity();
});


const clearForm = () => {
  formAnnouncement.reset();
  mapFilter.reset();
  map.closePopup();
  priceAnnouncement.placeholder = '1000';
  mainPinMarker.setLatLng({lat: LAT_TOKIO, lng: LNG_TOKIO});
  addressAnnouncement.value = `${mainPinMarker.getLatLng().lat}, ${mainPinMarker.getLatLng().lng}`;
  preview.src = 'img/muffin-grey.svg';
  if (previewHousingContainer.firstChild) {
    previewHousingContainer.firstChild.remove();
  }
};

const addlistener = (template) => {
  document.body.append(template);
  document.addEventListener ('click', () =>{
    template.remove();
  });
  document.addEventListener ('keydown', (evt) => {
    if (isEscapeKey(evt))  {
      evt.preventDefault();
      template.remove();
      document.removeEventListener('keydown', (evt));
    }
  });
};

const onSuccess = () => {
  clearForm();
  const successElement = successTemplate.cloneNode(true);
  addlistener(successElement);
};

const onError = () => {
  const errorElement = errorTemplate.cloneNode(true);
  addlistener(errorElement);
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

export {disableForm, enableForm};
