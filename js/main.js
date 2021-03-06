'use strict';
// Определяем константы
var ADS_NUMBER = 8;
var MIN_Y = 130;
var MAX_Y = 630;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = ['Описание1', 'Описание2', 'Описание3'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ads = [];

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAP = document.querySelector('.map');
var MAP_PINS = document.querySelector('.map__pins');

// Генерация случайных целочисленных чисел
var getRandomNum = function (min, max) {
  var num = Math.floor(min + Math.random() * (max - min));
  return num;
};

var findRandomEl = function (element) {
  return element[getRandomNum(0, element.length)];
};

var getRandomArr = function (arr) {
  var el = [];
  for (var i = 0; i < getRandomNum(0, arr.length) + 1; i++) {
    var feature = findRandomEl(arr);
    if (el.indexOf(feature) === -1) {
      el.push(feature);
    }
  }
  return el;
};

var getAddress = function (locationX, locationY) {
  return (locationX + ', ' + locationY);
};

var getAvatar = function (num) {
  return 'img/avatars/user0' + (num + 1) + '.png';
};

var createData = function (iterations) {
  var generatedData = [];

  for (var i = 0; i < iterations; i++) {
    //  Сформируем локацию на карту

    var locationX = getRandomNum(0, MAP.clientWidth);
    var locationY = getRandomNum(MIN_Y, MAX_Y);

    var location = {
      'x': locationX,
      'y': locationY
    };

    generatedData[i] = {
      'author': {
        'avatar': getAvatar(i)
      },
      'offer': {
        'title': 'Заголовок',
        'address': getAddress(locationX, locationY),
        'price': getRandomNum(100, 10000),
        'type': TYPES[getRandomNum(0, TYPES.length)],
        'rooms': getRandomNum(1, 5),
        'guests': getRandomNum(1, 5),
        'checkin': CHECKINS[getRandomNum(0, CHECKINS.length)],
        'checkout': CHECKOUTS[getRandomNum(0, CHECKOUTS.length)],
        'features': getRandomArr(FEATURES),
        'description': DESCRIPTION[getRandomNum(0, DESCRIPTION.length)],
        'photos': getRandomArr(PHOTOS)
      },
      'location': location
    };
  }
  return generatedData;
};

var makePin = function (ad) {
  var pin = pinTemplate.cloneNode(true);
  var avatar = pin.querySelector('img');
  var xOffset = ad.location.x - PIN_WIDTH / 2;
  var yOffset = ad.location.y - PIN_HEIGHT;
  pin.style.left = xOffset + 'px';
  pin.style.top = yOffset + 'px';
  avatar.src = ad.author.avatar;
  avatar.alt = ad.offer.title;
  return pin;
};

ads = createData(ADS_NUMBER);

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();

for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(makePin(ads[i]));
}

MAP_PINS.appendChild(fragment);
MAP.classList.remove('map--faded');
