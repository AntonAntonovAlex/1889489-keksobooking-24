const LAT_MIN = 35.65000;
const LAT_MAX = 35.70000;
const LNG_MIN = 139.70000;
const LNG_MAX = 139.80000;
const COMMA_LAT_LNG = 5;
const CHECKIN_AND_CHECKOUT = [
  '12:00',
  '13:00',
  '14:00',
];
const TYPE_BUILDING = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];
const DESCRIPTION_OFFER = [
  'Закрытая парковка',
  'Панорамное остекление',
  'Круглосуточный доступ',
];
const TITLE_OFFER = [
  'Заголовок 1',
  'Заголовок 2',
  'Заголовок 3',
  'Заголовок 4',
  'Заголовок 5',
];
const FEATURES_OFFER = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
const PHOTOS_OFFER = [
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

const getRandomArrayElement = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
};

const getArrayElements = (array) => {
  const randomLength = getRandomNumber(1, array.length-1);
  const randomArray = Array.from({length:randomLength});
  let cloneArray = array.slice();
  for (let i = 0; i < randomLength; i++) {
    let randomInteger = getRandomNumber(0, cloneArray.length-1);
    randomArray[i] = cloneArray[randomInteger];
    cloneArray.splice(randomInteger, 1);
  };
  return randomArray;
};
const createAnnouncement = (numberImage) => {
  const LAT_RANDOM = getRandomNumberComma(LAT_MIN, LAT_MAX, COMMA_LAT_LNG);
  const LNG_RANDOM = getRandomNumberComma(LNG_MIN, LNG_MAX, COMMA_LAT_LNG);
  const avatarValue = 'img/avatars/user' + numberImage + '.png';
  return {
    author: {
      avatar: avatarValue,
    },
    offer: {
      title: getRandomArrayElement(TITLE_OFFER),
      address: LAT_RANDOM + ', ' + LNG_RANDOM,
      price: getRandomNumber(1, 9999999),
      type: getRandomArrayElement(TYPE_BUILDING),
      rooms: getRandomNumber(1, 999),
      guests: getRandomNumber(1, 9999),
      checkin: getRandomArrayElement(CHECKIN_AND_CHECKOUT),
      checkout: getRandomArrayElement(CHECKIN_AND_CHECKOUT),
      features: getArrayElements(FEATURES_OFFER),
      description: getRandomArrayElement(DESCRIPTION_OFFER),
      photos: getArrayElements(PHOTOS_OFFER),
    },
    location: {
      lat: LAT_RANDOM,
      lng: LNG_RANDOM,
    },
  };
};
const newAnnouncement = [];
for (let i = 1; i <= 10; i++) {
  newAnnouncement[i-1] = createAnnouncement(i);
};

console.log(newAnnouncement);
