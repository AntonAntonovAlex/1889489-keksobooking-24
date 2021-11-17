import { rusBuildingTypes } from './constants.js';

const similarAnnouncementTemplate = document.querySelector('#card').content.querySelector('.popup');

const renderFeatures = (announcementElement, features, nodeFeatures) => {
  const announcementFeaturesContainer = announcementElement.querySelector(`.${nodeFeatures}s`);
  if (features) {
    announcementFeaturesContainer.innerHTML = '';
    features.forEach((feature) => {
      const featureElement = document.createElement('li');
      featureElement.classList.add(nodeFeatures);
      featureElement.classList.add(`${nodeFeatures}--${feature}`);
      announcementFeaturesContainer.appendChild(featureElement);
    });
    return;
  }
  announcementFeaturesContainer.classList.add('hidden');
};

const renderPhotos = (announcementElement, photos, nodePhoto, nodePhotos) => {
  if (photos) {
    const offerPhotoTemplate = announcementElement.querySelector(nodePhoto);
    announcementElement.querySelector(nodePhotos).innerHTML='';
    photos.forEach((photo) => {
      const offerPhotoTemplate2 = offerPhotoTemplate.cloneNode(true);
      offerPhotoTemplate2.src = photo;
      announcementElement.querySelector(nodePhotos).appendChild(offerPhotoTemplate2);
    });
    return;
  }
  announcementElement.querySelector(nodePhotos).classList.add('hidden');
};

const renderFieldCard = (announcementElement, nodeValue, offerValue, propertyValue, meaningString) => {
  if (offerValue) {
    announcementElement.querySelector(nodeValue)[propertyValue] = meaningString ? meaningString : offerValue;
  } else {
    announcementElement.querySelector(nodeValue).classList.add('hidden');
  }
};

const createCard = (author, offer) => {
  const {title, address, price, type, rooms, guests, checkin, checkout, features, description, photos} = offer;
  const {avatar} = author;
  const announcementElement = similarAnnouncementTemplate.cloneNode(true);
  renderFieldCard (announcementElement, '.popup__title', title, 'textContent');
  renderFieldCard (announcementElement, '.popup__text--address', address, 'textContent');
  renderFieldCard (announcementElement, '.popup__text--price', price, 'textContent', `${price} ₽/ночь`);
  renderFieldCard (announcementElement, '.popup__description', description, 'textContent');
  renderFieldCard (announcementElement, '.popup__text--capacity', rooms || guests, 'textContent', `${rooms} комнаты для ${guests} гостей`);
  renderFieldCard (announcementElement, '.popup__text--time', checkin || checkout, 'textContent', `Заезд после ${checkin}, выезд до ${checkout}`);
  renderFieldCard (announcementElement, '.popup__avatar', avatar, 'src');
  renderFieldCard (announcementElement, '.popup__type', type, 'textContent', rusBuildingTypes[type]);
  renderFeatures(announcementElement, features, 'popup__feature');
  renderPhotos(announcementElement, photos, '.popup__photo', '.popup__photos');
  return announcementElement;
};

export {createCard};
