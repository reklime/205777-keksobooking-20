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

var MAIN_PIN = MAP.querySelector('.map__pin--main');
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = MAIN_PIN_WIDTH + 22;


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


var makePinsOnMap = function (myAds) {
  for (var i = 0; i < myAds.length; i++) {
    fragment.appendChild(makePin(myAds[i]));
  }
};

makePinsOnMap(ads);
MAP_PINS.appendChild(fragment);
// MAP.classList.remove('map--faded');


// module4 task 2
var AD_FORM = document.querySelector('.ad-form');
var fieldsets = AD_FORM.querySelectorAll('fieldset');

var roomNumber = AD_FORM.querySelector('#room_number');
var capacity = AD_FORM.querySelector('#capacity');

var disableFieldsets = function (fieldsetsList) {
  for (var i = 0; i < fieldsetsList.length; i++) {
    fieldsetsList[i].disabled = true;
  }
};

var enableFieldsets = function (fieldsetsList) {
  for (var i = 0; i < fieldsetsList.length; i++) {
    fieldsetsList[i].disabled = false;
  }
};


// Функция определения координат для адреса
var determinePinAddress = function () {
  var addressInput = AD_FORM.querySelector('#address');
  // проверим активна ли страница
  if (MAP.classList.contains('map--faded')) {
    //  помним что ПИН круглый.
    addressInput.value = Math.round(MAIN_PIN_WIDTH / 2 + MAIN_PIN.offsetLeft) + ' ' + Math.round(MAIN_PIN_WIDTH / 2 + MAIN_PIN.offsetTop);
  } else {
    addressInput.value = Math.round(MAIN_PIN_WIDTH / 2 + MAIN_PIN.offsetLeft) + ' ' + (MAIN_PIN_HEIGHT + MAIN_PIN.offsetTop);
  }

  // Пусть будет на всякий.
  // return addressInput.value;
};


// Функция разблокировки страницы
var unblockPage = function (evt) {
  if (evt.button === 0 || evt.key === 'Enter') {
    MAP.classList.remove('map--faded');
    AD_FORM.classList.remove('ad-form--disabled');
    enableFieldsets(fieldsets);

    // Удалим отслеживание событий
    MAIN_PIN.removeEventListener('mousedown', unblockPage);
    MAIN_PIN.removeEventListener('keydown', unblockPage);
    determinePinAddress();

  }
};

// Функция проверки соответствия комнат и мест. Выражаю мнение, что лучше блокировать недопустимые варианты, потому как они могут быть изначально в разметке (как в примере)
// Вообще надо бы переделать красивее, но я уже 4 часа потратил на гугление алгоритмов построения зависимых списков и большинство решений избыточны для задачи
var checkCapacity = function (roomsNum) {
  var options = capacity.children;
  var item;
  var value;
  roomsNum = parseInt(roomsNum, 10);
  if (roomsNum !== 100) {

    for (var i = 0; i < options.length; i++) {
      item = options[i];
      value = Number(item.value);
      if (value > roomsNum || value === 0) {
        item.disabled = true;
        item.selected = false;
      } else {
        item.disabled = false;
      }
    }
  } else {
    for (var j = 0; j < options.length; j++) {
      options[j].disabled = true;
    }
    options[options.length - 1].disabled = false;
    options[options.length - 1].selected = true;
  }
};


// Если пыцкнули по красному пину
MAIN_PIN.addEventListener('mousedown', unblockPage);
MAIN_PIN.addEventListener('keydown', unblockPage);


// Заблокируем все филдсеты
disableFieldsets(fieldsets);
// Определяем координаты сразу после загрузки страницы согласно ТЗ
determinePinAddress();

// проверим форму сразу, т.к в изначальной разметке selected не корректный, а менять не спортивно
checkCapacity(roomNumber.value, capacity.value);

// Прослушивание изменений в форме
AD_FORM.addEventListener('change', function (evt) {
  if (evt.target === capacity || evt.target === roomNumber) {
    checkCapacity(roomNumber.value);
  // capacity.setCustomValidity(checkCapacity(roomNumber.value, capacity.value));
  }
});

