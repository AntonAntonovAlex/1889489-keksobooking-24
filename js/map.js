import { enableForm, disableForm } from './form.js';
import { getRound } from './util.js';
import { createCard } from './popup.js';
import { createAnnouncements } from './data.js';

const addressAnnouncement =  document.querySelector('#address');
const ANNOUNCEMENTS_NUMBER = 10;
const similarAnnouncements = createAnnouncements(ANNOUNCEMENTS_NUMBER);
disableForm();
const map = L.map('map-canvas')
  .on('load', () => {
    enableForm();
  })
  .setView({
    lat: 35.68294,
    lng: 139.76764,
  }, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: 35.68294,
    lng: 139.76764,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);
addressAnnouncement.value = `${mainPinMarker.getLatLng().lat}, ${mainPinMarker.getLatLng().lng}`;

mainPinMarker.on('moveend', (evt) => {
  addressAnnouncement.value = `${getRound(evt.target.getLatLng().lat.toFixed(5))}, ${getRound(evt.target.getLatLng().lng.toFixed(5))}`;
});

const createMarker = (announcement) => {
  const {lat, lng} = announcement.location;

  const icon = L.icon({
    iconUrl: 'img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
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
};

similarAnnouncements.forEach((announcement) => {
  createMarker(announcement);
});
