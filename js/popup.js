import { createAnnouncements } from './data.js';
const ANNOUNCEMENTS_NUMBER = 10;
const RUS_BUILDING_TYPES = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};
const similarAnnouncements = createAnnouncements(ANNOUNCEMENTS_NUMBER);
const similarAnnouncementTemplate = document.querySelector('#card').content.querySelector('.popup');
const similarListAnnouncement = document.querySelector('.map__canvas');
const similarListAnnouncements = [];

const renderFeatures = (announcementElement, features, nodeFeatures) => {
  if (features) {
    const featuresList = announcementElement.querySelectorAll(`.${nodeFeatures}`);
    featuresList.forEach((featuresListItem) => {
      const isNecessary = features.some((offerFeature) => featuresListItem.classList.contains(`${nodeFeatures}--${offerFeature}`));
      if (!isNecessary) {
        featuresListItem.remove();
      }
    });
  } else {
    announcementElement.querySelector(`'.${nodeFeatures}s'`).classList.add('hidden');
  }
  return announcementElement;
};

const renderPhotos = (announcementElement, photos, nodePhoto, nodePhotos) => {
  if (photos) {
    announcementElement.querySelector(nodePhoto).src = photos[0];
    for (let i = 1; i<photos.length; i++) {
      const offerPhotoTemplate = announcementElement.querySelector(nodePhoto).cloneNode(true);
      offerPhotoTemplate.src = photos[i];
      announcementElement.querySelector(nodePhotos).appendChild(offerPhotoTemplate);
    }
  } else {
    announcementElement.querySelector(nodePhotos).classList.add('hidden');
  }
  return announcementElement;
};

const renderFieldCard = (announcementElement, nodeValue, offerValue, meaningString) => {
  if (offerValue) {
    if (meaningString) {
      announcementElement.querySelector(nodeValue).textContent = `${offerValue} ${meaningString}`;
    } else {
      announcementElement.querySelector(nodeValue).textContent = offerValue;
    }
  } else {
    announcementElement.querySelector(nodeValue).classList.add('hidden');
  }
  return announcementElement;
};

const createCard = (announcementElement, author, offer) => {
  const {title, address, price, type, rooms, guests, checkin, checkout, features, description, photos} = offer;
  const {avatar} = author;
  renderFieldCard (announcementElement, '.popup__title', title);
  renderFieldCard (announcementElement, '.popup__text--address', address);
  renderFieldCard (announcementElement, '.popup__text--price', price, '₽/ночь');
  renderFieldCard (announcementElement, '.popup__description', description);
  if (rooms || guests) {
    announcementElement.querySelector('.popup__text--capacity').textContent = `${rooms} комнаты для ${guests} гостей`;
  } else {
    announcementElement.querySelector('.popup__text--capacity').classList.add('hidden');
  }
  if (checkin || checkout) {
    announcementElement.querySelector('.popup__text--time').textContent = `Заезд после ${checkin}, выезд до ${checkout}`;
  } else {
    announcementElement.querySelector('.popup__text--time').classList.add('hidden');
  }
  if (avatar) {
    announcementElement.querySelector('.popup__avatar').src = avatar;
  } else {
    announcementElement.querySelector('.popup__avatar').classList.add('hidden');
  }
  if (type) {
    announcementElement.querySelector('.popup__type').textContent = RUS_BUILDING_TYPES[type];
  } else {
    announcementElement.querySelector('.popup__type').classList.add('hidden');
  }
  renderFeatures(announcementElement, features, 'popup__feature');
  renderPhotos(announcementElement, photos, '.popup__photo', '.popup__photos');
  return announcementElement;
};

similarAnnouncements.forEach(({author, offer}) => {
  const announcementElement = similarAnnouncementTemplate.cloneNode(true);
  createCard(announcementElement, author, offer);
  similarListAnnouncements.push(announcementElement);
});

similarListAnnouncement.appendChild(similarListAnnouncements[0]);
