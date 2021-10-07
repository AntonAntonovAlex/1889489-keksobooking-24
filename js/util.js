const LAT_MIN = 35.65000;
const LAT_MAX = 35.70000;
const LNG_MIN = 139.70000;
const LNG_MAX = 139.80000;
const COMMA_LAT_LNG = 5;
const CHECKIN_AND_CHECKOUT_TIMES = [
  '12:00',
  '13:00',
  '14:00',
];
const BUILDING_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];
const OFFER_DESCRIPTIONS = [
  'Закрытая парковка',
  'Панорамное остекление',
  'Круглосуточный доступ',
];
const OFFER_TITLES = [
  'Заголовок 1',
  'Заголовок 2',
  'Заголовок 3',
  'Заголовок 4',
  'Заголовок 5',
];
const OFFER_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
const OFFER_PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

function getRandomNumber(min, max) {
  if (max<0 || min<0) {
    return alert('Значения должны быть больше нуля');
  }
  if (max<=min) {
    return alert('Неверное условие');
  }
  return Math.round(Math.random() * (max - min) + min);
}
getRandomNumber();

function getRandomNumberComma(min, max, comma) {
  if (max<0 || min<0 || comma<0) {
    return alert('Значения должны быть больше нуля');
  }
  if (max<=min) {
    return alert('Неверное условие');
  }
  const num = (Math.random() * (max - min) + min);
  return +num.toFixed(comma);
}
getRandomNumberComma();

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];

const getArrayElements = (items) => {
  const randomLength = getRandomNumber(1, items.length-1);
  const randomItems = [];
  const cloneItem = items.slice();
  for (let i = 0; i < randomLength; i++) {
    const randomInteger = getRandomNumber(0, cloneItem.length-1);
    randomItems[i] = cloneItem[randomInteger];
    cloneItem.splice(randomInteger, 1);
  }
  return randomItems;
};

const createAnnouncement = (numberImage) => {
  const LAT_RANDOM = getRandomNumberComma(LAT_MIN, LAT_MAX, COMMA_LAT_LNG);
  const LNG_RANDOM = getRandomNumberComma(LNG_MIN, LNG_MAX, COMMA_LAT_LNG);
  numberImage>=10 ? numberImage : numberImage = `0${numberImage}`;
  const avatarValue = `img/avatars/user${numberImage}.png`;
  return {
    author: {
      avatar: avatarValue,
    },
    offer: {
      title: getRandomArrayElement(OFFER_TITLES),
      address: `${LAT_RANDOM}, ${LNG_RANDOM}`,
      price: getRandomNumber(1, 9999999),
      type: getRandomArrayElement(BUILDING_TYPES),
      rooms: getRandomNumber(1, 999),
      guests: getRandomNumber(1, 9999),
      checkin: getRandomArrayElement(CHECKIN_AND_CHECKOUT_TIMES),
      checkout: getRandomArrayElement(CHECKIN_AND_CHECKOUT_TIMES),
      features: getArrayElements(OFFER_FEATURES),
      description: getRandomArrayElement(OFFER_DESCRIPTIONS),
      photos: getArrayElements(OFFER_PHOTOS),
    },
    location: {
      lat: LAT_RANDOM,
      lng: LNG_RANDOM,
    },
  };
};
const createAnnouncements = (announcementsNumber) => {
  const newAnnouncements = [];
  for (let i = 0; i < announcementsNumber; i++) {
    newAnnouncements[i] = createAnnouncement(i+1);
  }
  return newAnnouncements;
};
export {createAnnouncements};
