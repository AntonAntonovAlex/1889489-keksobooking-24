import { enableForm, disableForm } from './form.js';
import { getRound, showAlert, debounce } from './utils.js';
import { createCard } from './popup.js';
import { fetchData } from './api.js';
import { ANNOUNCEMENTS_NUMBER, LAT_TOKIO, LNG_TOKIO } from './constants.js';

const PriceAnnouncementFilter = {
  LOW: 'low',
  HIGH: 'high',
  MIDDLE: 'middle',
};
const LOW_PRICE =  10000;
const HIGH_PRICE = 50000;
const MAIN_PIN_SIZE = 52;
const USER_PIN_SIZE = 40;
const PIN_ICON_IMAGE = 'img/main-pin.svg';
const MARKER_ICON_IMAGE = 'img/pin.svg';
const URL = 'https://24.javascript.pages.academy/keksobooking/data';
const addressAnnouncement =  document.querySelector('#address');
const housingType =  document.querySelector('#housing-type');
const housingPrice =  document.querySelector('#housing-price');
const housingRooms =  document.querySelector('#housing-rooms');
const housingGuests =  document.querySelector('#housing-guests');
const mapFeatures = document.querySelector('.map__features');
const allFormFilters = document.querySelectorAll('.map__filter');
const mapFilter = document.querySelector('.map__filters');
let similarAnnouncements = [];

disableForm();

const disableFilter = () => {
  mapFilter.classList.add('ad-form--disabled');
  mapFeatures.setAttribute('disabled', 'disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.setAttribute('disabled', 'disabled');
  });
};

disableFilter();

const enableFilter = () => {
  mapFilter.classList.remove('ad-form--disabled');
  mapFeatures.removeAttribute('disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.removeAttribute('disabled');
  });
};

const onError = () => {
  showAlert('Не удалось загрузить объявления. Попробуйте перезагрузить страницу');
  disableFilter();
};

const map = L.map('map-canvas')
  .on('load', () => {
    fetchData(URL, 'GET', onSuccess, onError);
    enableForm();
  })
  .setView({
    lat: LAT_TOKIO,
    lng: LNG_TOKIO,
  }, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: PIN_ICON_IMAGE,
  iconSize: [MAIN_PIN_SIZE, MAIN_PIN_SIZE],
  iconAnchor: [MAIN_PIN_SIZE/2, MAIN_PIN_SIZE],
});

const mainPinMarker = L.marker(
  {
    lat: LAT_TOKIO,
    lng: LNG_TOKIO,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);
addressAnnouncement.value = `${mainPinMarker.getLatLng().lat}, ${mainPinMarker.getLatLng().lng}`;

mainPinMarker.on('drag', (evt) => {
  addressAnnouncement.value = `${getRound(evt.target.getLatLng().lat.toFixed(5))}, ${getRound(evt.target.getLatLng().lng.toFixed(5))}`;
});

const markerGroup = L.layerGroup().addTo(map);

const createMarkers = (announcements) => {
  markerGroup.clearLayers();
  announcements.forEach((announcement) => {
    const {lat, lng} = announcement.location;
    const icon = L.icon({
      iconUrl: MARKER_ICON_IMAGE,
      iconSize: [USER_PIN_SIZE, USER_PIN_SIZE],
      iconAnchor: [USER_PIN_SIZE/2, USER_PIN_SIZE],
    });

    const marker = L.marker(
      {
        lat,
        lng,
      },
      {
        icon,
      },
    );

    marker
      .addTo(markerGroup)
      .bindPopup(createCard(announcement.author, announcement.offer));

  });
};

const comparePrices = (priceFilter, priceAnnouncement) => {
  if (priceFilter === PriceAnnouncementFilter.LOW && priceAnnouncement > LOW_PRICE) {
    return false;
  }
  if (priceFilter === PriceAnnouncementFilter.HIGH && priceAnnouncement < HIGH_PRICE) {
    return false;
  }
  if (priceFilter === PriceAnnouncementFilter.MIDDLE && priceAnnouncement > HIGH_PRICE || priceAnnouncement < LOW_PRICE) {
    return false;
  }
  return true;
};

const compareAnnouncements = (announcement) => {
  if (housingType.value !== 'any' && housingType.value !== announcement.offer.type) {
    return false;
  }
  if (housingRooms.value !== 'any' && Number(housingRooms.value) !== announcement.offer.rooms) {
    return false;
  }
  if (housingGuests.value !== 'any' && Number(housingGuests.value) !== announcement.offer.guests) {
    return false;
  }
  if (housingPrice.value !== 'any') {
    return comparePrices(housingPrice.value, announcement.offer.price);
  }
  return true;
};

const getAnnouncementRank = (announcement) => announcement.offer.features ? announcement.offer.features.length : 0;

const compareAnnouncementFeatures = (announcementA, announcementB) => {
  const rankA = getAnnouncementRank(announcementA);
  const rankB = getAnnouncementRank(announcementB);
  return rankB - rankA;
};

const debounceFunction = debounce((result) => createMarkers(result));

const setHousingFiltersChange = (announcements) => {
  mapFilter.addEventListener('change', () => {
    const filterCheckedFeatures = mapFeatures.querySelectorAll('.map__checkbox:checked');
    let result = announcements.slice();
    if (housingType.value !== 'any' || housingPrice.value !== 'any' || housingRooms.value !== 'any' || housingGuests.value !== 'any') {
      result = announcements.filter(compareAnnouncements);
    }
    if (filterCheckedFeatures.length !== 0) {
      result = result.filter((element) => {
        if (!element.offer.features) {
          return false;
        }
        return Array.from(filterCheckedFeatures).every((feature) => element.offer.features.includes(feature.defaultValue));
      });
    }
    debounceFunction(result
      .sort(compareAnnouncementFeatures)
      .slice(0, ANNOUNCEMENTS_NUMBER));
  });
};

function onSuccess(announcements) {
  similarAnnouncements = announcements;
  createMarkers(announcements.slice(0, ANNOUNCEMENTS_NUMBER));
  setHousingFiltersChange(announcements);
  enableFilter();
}

export {mainPinMarker, map, similarAnnouncements, createMarkers};
