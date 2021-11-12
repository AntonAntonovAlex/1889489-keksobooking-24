import { enableForm, disableForm } from './form.js';
import { getRound, showAlert } from './util.js';
import { createCard } from './popup.js';
import { fetchData } from './api.js';
import { debounce } from './utils/debounce.js';

const LOW_PRICE =  10000;
const HIGH_PRICE = 50000;
const MAIN_PIN_SIZE = 52;
const USER_PIN_SIZE = 40;
const LAT_TOKIO = 35.68294;
const LNG_TOKIO = 139.76764;
const ANNOUNCEMENTS_NUMBER = 10;
const URL = 'https://24.javascript.pages.academy/keksobooking/data';
const addressAnnouncement =  document.querySelector('#address');
const housingType =  document.querySelector('#housing-type');
const housingPrice =  document.querySelector('#housing-price');
const housingRooms =  document.querySelector('#housing-rooms');
const housingGuests =  document.querySelector('#housing-guests');
const mapFeatures = document.querySelector('.map__features');
const allFormFilters = document.querySelectorAll('.map__filter');
const mapFilter = document.querySelector('.map__filters');
let similarAnnouncements = new Array();

const disableFilter = () => {
  mapFilter.classList.add('ad-form--disabled');
  mapFeatures.setAttribute('disabled', 'disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.setAttribute('disabled', 'disabled');
  });
};

const enableFilter = () => {
  mapFilter.classList.remove('ad-form--disabled');
  mapFeatures.removeAttribute('disabled');
  allFormFilters.forEach((formFilter) => {
    formFilter.removeAttribute('disabled');
  });
};

disableForm();
disableFilter();

const map = L.map('map-canvas')
  .on('load', () => {
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
  iconUrl: 'img/main-pin.svg',
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
      iconUrl: 'img/pin.svg',
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

const onError = () => {
  showAlert('Не удалось загрузить объявления. Попробуйте перезагрузить страницу');
  disableFilter();
};

const comparePrices = (priceFilter, priceAnnouncement) => {
  if (priceFilter === 'low' && priceAnnouncement > LOW_PRICE){
    return(false);
  } else if (priceFilter === 'high' && priceAnnouncement < HIGH_PRICE) {
    return(false);
  } else if (priceFilter === 'middle' && priceAnnouncement > HIGH_PRICE || priceAnnouncement < LOW_PRICE) {
    return(false);
  } else {
    return(true);
  }
};

const compareAnnouncements = (announcement) => {
  if (housingType.value !== 'any' && housingType.value !== announcement.offer.type) {
    return(false);
  } else if (housingRooms.value !== 'any' && Number(housingRooms.value) !== announcement.offer.rooms) {
    return(false);
  } else if (housingGuests.value !== 'any' && Number(housingGuests.value) !== announcement.offer.guests) {
    return(false);
  } else if (housingPrice.value !== 'any') {
    return(comparePrices(housingPrice.value, announcement.offer.price));
  } else {
    return(true);
  }
};

const getAnnouncementRank = (announcement) => {
  const filterFeatures = document.querySelectorAll('[name="features"]');
  let rank = 0;
  if (!announcement.offer.features) {
    return rank;
  }
  filterFeatures.forEach((features) => {
    if (features.checked) {
      if (announcement.offer.features.includes(features.value)) {
        rank +=1;
      }
    }
  });
  return rank;
};

const compareAnnouncementFeatures = (announcementA, announcementB) => {
  const rankA = getAnnouncementRank(announcementA);
  const rankB = getAnnouncementRank(announcementB);
  return rankB - rankA;
};

const setHousingFiltersChange = (announcements) =>{
  mapFilter.addEventListener('change', () => {
    let result = announcements;
    if (housingType.value !== 'any' || housingPrice.value !== 'any' || housingRooms.value !== 'any' || housingGuests.value !== 'any') {
      result = announcements.filter(compareAnnouncements);
    }
    debounce(() => createMarkers(result
      .slice()
      .sort(compareAnnouncementFeatures)
      .slice(0, ANNOUNCEMENTS_NUMBER)))();
  });
};

const onSuccess = (announcements) => {
  similarAnnouncements = announcements;
  createMarkers(announcements.slice(0, ANNOUNCEMENTS_NUMBER));
  setHousingFiltersChange(announcements);
  enableFilter();
};

fetchData(URL, 'GET', onSuccess, onError);

export {mainPinMarker, LAT_TOKIO, LNG_TOKIO, addressAnnouncement, map, mapFilter, similarAnnouncements, createMarkers, ANNOUNCEMENTS_NUMBER};
