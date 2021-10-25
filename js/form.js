const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE = 1000000;
const allFormElements = document.querySelectorAll('.ad-form__element');
const allFormFilters = document.querySelectorAll('.map__filter');
const formAnnouncement = document.querySelector('.ad-form');
const headerFormAnnouncement =  document.querySelector('.ad-form-header');
const mapFilter = document.querySelector('.map__filters');
const mapFeatures = document.querySelector('.map__features');

const disableForm = () => {
  formAnnouncement.classList.add('ad-form--disabled');
  headerFormAnnouncement.setAttribute('disabled', 'disabled');

  allFormElements.forEach((formElement) => {
    formElement.setAttribute('disabled', 'disabled');
  });
  mapFilter.classList.add('ad-form--disabled');
  mapFeatures.setAttribute('disabled', 'disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.setAttribute('disabled', 'disabled');
  });
};

const enableForm = () => {
  formAnnouncement.classList.remove('ad-form--disabled');
  headerFormAnnouncement.removeAttribute('disabled');

  allFormElements.forEach((formElement) => {
    formElement.removeAttribute('disabled');
  });
  mapFilter.classList.remove('ad-form--disabled');
  mapFeatures.removeAttribute('disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.removeAttribute('disabled');
  });
};

export {enableForm, disableForm};

const titleAnnouncement =  document.querySelector('#title');
titleAnnouncement.addEventListener('input', () => {
  const valueLength = titleAnnouncement.value.length;
  if (valueLength < MIN_TITLE_LENGTH) {
    titleAnnouncement.setCustomValidity(`Ещё ${MIN_TITLE_LENGTH - valueLength} симв.`);
  } else if (valueLength > MAX_TITLE_LENGTH) {
    titleAnnouncement.setCustomValidity(`Удалите ${valueLength - MAX_TITLE_LENGTH} симв.`);
  } else {
    titleAnnouncement.setCustomValidity('');
  }
  titleAnnouncement.reportValidity();
});

const priceAnnouncement =  document.querySelector('#price');
priceAnnouncement.addEventListener('input', () => {
  const valuePrice = priceAnnouncement.value;
  if (valuePrice > MAX_PRICE) {
    priceAnnouncement.setCustomValidity('Цена не должна превышать 1 000 000');
  } else {
    priceAnnouncement.setCustomValidity('');
  }
  priceAnnouncement.reportValidity();
});

const roomNumberAnnouncement =  document.querySelector('#room_number');
const capacityRoomAnnouncement =  document.querySelector('#capacity');
const compareCapacityRoom = (roomNumber, capacityRoom) => {
  roomNumber = Number(roomNumber);
  capacityRoom = Number(capacityRoom);
  if (capacityRoom === 0) {
    if (roomNumber === 100) {
      capacityRoomAnnouncement.setCustomValidity('');
    } else {
      capacityRoomAnnouncement.setCustomValidity('Не подхoдит для выбранного кол-ва комнат');
    }
  }
  else if (roomNumber === capacityRoom) {
    capacityRoomAnnouncement.setCustomValidity('');
  } else if (roomNumber === capacityRoom || roomNumber-1 === capacityRoom) {
    capacityRoomAnnouncement.setCustomValidity('');
  } else if (roomNumber === capacityRoom || roomNumber-1 === capacityRoom || roomNumber-2 === capacityRoom) {
    capacityRoomAnnouncement.setCustomValidity('');
  } else {
    capacityRoomAnnouncement.setCustomValidity('Не подхoдит для выбранного кол-ва комнат');
  }
};

roomNumberAnnouncement.addEventListener('change', () => {
  compareCapacityRoom(roomNumberAnnouncement.value, capacityRoomAnnouncement.value);
  capacityRoomAnnouncement.reportValidity();
});

capacityRoomAnnouncement.addEventListener('change', () => {
  compareCapacityRoom(roomNumberAnnouncement.value, capacityRoomAnnouncement.value);
  capacityRoomAnnouncement.reportValidity();
});


