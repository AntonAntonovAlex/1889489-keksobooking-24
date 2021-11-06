import { enableForm, disableForm, disableFilter } from './form.js';
import { getRound } from './util.js';
import { createCard } from './popup.js';
import { getData } from './api.js';

const addressAnnouncement =  document.querySelector('#address');
const MAIN_PIN_SIZE = 52;
const USER_PIN_SIZE = 40;
const LAT_TOKIO = 35.68294;
const LNG_TOKIO = 139.76764;
const ANNOUNCEMENTS_NUMBER = 10;

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

const createMarker = (announcements) => {
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
      .addTo(map)
      .bindPopup(createCard(announcement.author, announcement.offer));

  });
};

getData((announcements) => {
  createMarker(announcements.slice(0, ANNOUNCEMENTS_NUMBER));
});

export {mainPinMarker, LAT_TOKIO, LNG_TOKIO, addressAnnouncement, map};
