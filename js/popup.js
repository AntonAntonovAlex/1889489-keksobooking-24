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
similarAnnouncements.forEach(({author, offer}) => {
  const annoucementElement = similarAnnouncementTemplate.cloneNode(true);
  if (offer.title) {
    annoucementElement.querySelector('.popup__title').textContent = offer.title;
  } else {
    annoucementElement.querySelector('.popup__title').classList.add('hidden');
  }
  if (offer.address) {
    annoucementElement.querySelector('.popup__text--address').textContent = offer.address;
  } else {
    annoucementElement.querySelector('.popup__text--address').classList.add('hidden');
  }
  if (offer.price) {
    annoucementElement.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
  } else {
    annoucementElement.querySelector('.popup__text--price').classList.add('hidden');
  }
  if (offer.rooms || offer.guests) {
    annoucementElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  } else {
    annoucementElement.querySelector('.popup__text--capacity').classList.add('hidden');
  }
  if (offer.checkin || offer.checkout) {
    annoucementElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  } else {
    annoucementElement.querySelector('.popup__text--time').classList.add('hidden');
  }
  if (offer.description) {
    annoucementElement.querySelector('.popup__description').textContent = offer.description;
  } else {
    annoucementElement.querySelector('.popup__description').classList.add('hidden');
  }
  if (author.avatar) {
    annoucementElement.querySelector('.popup__avatar').src = author.avatar;
  } else {
    annoucementElement.querySelector('.popup__avatar').classList.add('hidden');
  }
  if (offer.type) {
    annoucementElement.querySelector('.popup__type').textContent = RUS_BUILDING_TYPES[offer.type];
  } else {
    annoucementElement.querySelector('.popup__type').classList.add('hidden');
  }
  if (offer.features) {
    const featuresList = annoucementElement.querySelectorAll('.popup__feature');
    featuresList.forEach((featuresListItem) => {
      const isNecessary = offer.features.some((offerFeature) => featuresListItem.classList.contains(`popup__feature--${offerFeature}`));
      if (!isNecessary) {
        featuresListItem.remove();
      }
    });
  } else {
    annoucementElement.querySelector('.popup__features').classList.add('hidden');
  }
  if (offer.photos) {
    annoucementElement.querySelector('.popup__photo').src = offer.photos[0];
    for (let i = 1; i<offer.photos.length; i++) {
      const offerPhotoTemplate = annoucementElement.querySelector('.popup__photo').cloneNode(true);
      offerPhotoTemplate.src = offer.photos[i];
      annoucementElement.querySelector('.popup__photos').appendChild(offerPhotoTemplate);
    }
  } else {
    annoucementElement.querySelector('.popup__photos').classList.add('hidden');
  }

  similarListAnnouncements.push(annoucementElement);
});

similarListAnnouncement.appendChild(similarListAnnouncements[0]);
