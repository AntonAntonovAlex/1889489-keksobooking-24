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
};

const renderFieldCard = (announcementElement, nodeValue, offerValue, propertyValue, meaningString) => {
  if (offerValue) {
    announcementElement.querySelector(nodeValue)[propertyValue] = meaningString ? meaningString : offerValue;
  } else {
    announcementElement.querySelector(nodeValue).classList.add('hidden');
  }
};

const createCard = (announcementElement, author, offer) => {
  const {title, address, price, type, rooms, guests, checkin, checkout, features, description, photos} = offer;
  const {avatar} = author;
  renderFieldCard (announcementElement, '.popup__title', title, 'textContent');
  renderFieldCard (announcementElement, '.popup__text--address', address, 'textContent');
  renderFieldCard (announcementElement, '.popup__text--price', price, 'textContent', `${price} ₽/ночь`);
  renderFieldCard (announcementElement, '.popup__description', description, 'textContent');
  renderFieldCard (announcementElement, '.popup__text--capacity', rooms || guests, 'textContent', `${rooms} комнаты для ${guests} гостей`);
  renderFieldCard (announcementElement, '.popup__text--time', checkin || checkout, 'textContent', `Заезд после ${checkin}, выезд до ${checkout}`);
  renderFieldCard (announcementElement, '.popup__avatar', avatar, 'src');
  renderFieldCard (announcementElement, '.popup__type', type, 'textContent', RUS_BUILDING_TYPES[type]);
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
