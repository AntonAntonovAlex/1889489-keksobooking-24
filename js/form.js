import { MAX_PRICE, MIN_HOUSING_PRICES } from './data.js';
import { sendData } from './api.js';
import { isEscapeKey } from './util.js';
import { LAT_TOKIO, LNG_TOKIO, mainPinMarker, addressAnnouncement, map } from './map.js';

const allFormElements = document.querySelectorAll('.ad-form__element');
const allFormFilters = document.querySelectorAll('.map__filter');
const formAnnouncement = document.querySelector('.ad-form');
const headerFormAnnouncement =  document.querySelector('.ad-form-header');
const mapFilter = document.querySelector('.map__filters');
const mapFeatures = document.querySelector('.map__features');
const priceAnnouncement =  document.querySelector('#price');
const roomNumberAnnouncement =  document.querySelector('#room_number');
const capacityRoomAnnouncement =  document.querySelector('#capacity');
const timeinAnnouncement =  document.querySelector('#timein');
const timeoutAnnouncement =  document.querySelector('#timeout');
const typeBuildingAnnouncement =  document.querySelector('#type');
const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');
const resetButton = document.querySelector('.ad-form__reset');

const disableFilter = () => {
  mapFilter.classList.add('ad-form--disabled');
  mapFeatures.setAttribute('disabled', 'disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.setAttribute('disabled', 'disabled');
  });
};

const disableForm = () => {
  formAnnouncement.classList.add('ad-form--disabled');
  headerFormAnnouncement.setAttribute('disabled', 'disabled');

  allFormElements.forEach((formElement) => {
    formElement.setAttribute('disabled', 'disabled');
  });
};

const enableFilter = () => {
  mapFilter.classList.remove('ad-form--disabled');
  mapFeatures.removeAttribute('disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.removeAttribute('disabled');
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


formAnnouncement.addEventListener ('submit', (evt) => {
  evt.preventDefault();
  sendData(
    new FormData(evt.target),
  );
});

const showSuccess = () => {
  document.body.append(successTemplate);
  document.addEventListener ('click', () =>{
    successTemplate.remove();
  });
  document.addEventListener ('keydown', (evt) => {
    if (isEscapeKey(evt))  {
      evt.preventDefault();
      successTemplate.remove();
      document.removeEventListener('keydown', (evt));
    }
  });
};

const showEror = () => {
  document.body.append(errorTemplate);
  document.addEventListener ('click', () =>{
    errorTemplate.remove();
  });
  document.addEventListener ('keydown', (evt) => {
    if (isEscapeKey(evt))  {
      evt.preventDefault();
      errorTemplate.remove();
      document.removeEventListener('keydown', (evt));
    }
  });
};

const clearForm = () => {
  formAnnouncement.reset();
  mapFilter.reset();
  map.closePopup();
  priceAnnouncement.placeholder = '1000';
  mainPinMarker.setLatLng({lat: LAT_TOKIO, lng: LNG_TOKIO});
  addressAnnouncement.value = `${mainPinMarker.getLatLng().lat}, ${mainPinMarker.getLatLng().lng}`;
};

resetButton.addEventListener('click', () => {
  clearForm();
});

export {disableForm, enableForm, disableFilter, enableFilter, showEror, showSuccess, clearForm};
