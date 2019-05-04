/* eslint-disable no-console */
'use strict';

//Get elements
const inputsRadioEls = document.querySelectorAll('.number-cards__button');
const btnStartEl = document.querySelector('.btn-start');
const listResultsEl = document.querySelector('.app-results');
const appMessageEl = document.querySelector('.app-message');

let NUMBER = '';
let cardsFromAPI = [];

let pairCards = [];

//Functions
function drawCards(array) {
  listResultsEl.innerHTML = '';
  //Paint as many cards as the user choice
  for (const element of array) {
    const { image, pair } = element;

    const itemEl = document.createElement('li');
    const divFaceEl = document.createElement('div');
    divFaceEl.style.backgroundImage = `url(${image})`;
    divFaceEl.setAttribute('data-pair', pair);
    divFaceEl.classList.add('card', 'card--face', 'card--hidden');

    const divBackEl = document.createElement('div');
    divBackEl.classList.add('card', 'card--back');

    itemEl.appendChild(divFaceEl);
    itemEl.appendChild(divBackEl);
    listResultsEl.appendChild(itemEl);
  }
}

function handlerCardsClick(event) {
  const selectedCardEl = event.currentTarget;
  selectedCardEl.classList.toggle('card--hidden');

  const selectedCardFaceEl = selectedCardEl.previousSibling;
  const selectedCardBackEl = selectedCardEl.nextSibling;

  if (selectedCardFaceEl) {
    selectedCardFaceEl.classList.toggle('card--hidden');
  }
  if (selectedCardBackEl) {
    selectedCardBackEl.classList.toggle('card--hidden');
  }

  //Instructions just to be applied when one card is already up. Condition??
  const cardsDown = [];
  const cardsUp = [];
  const allCardsFaceEl = document.querySelectorAll('.card--face');
  for (const card of allCardsFaceEl) {
    if (card.classList.contains('card--hidden')) {
      cardsDown.push(card);
    } else {
      cardsUp.push(card);
    }
  }

  const cardsUpNow = NUMBER - cardsDown.length;
  const selectedCardPairId = parseInt(
    selectedCardFaceEl.getAttribute('data-pair')
  );

  if (cardsUpNow === 1) {
    pairCards = [];
    pairCards[0] = selectedCardPairId;
    appMessageEl.innerHTML = '';
    console.log(selectedCardPairId);
  } else if (cardsUpNow === 2) {
    pairCards[1] = selectedCardPairId;
    console.log('solo hay una carta boca arriba');
    if (pairCards[0] === pairCards[1]) {
      //Print message on HTML
      appMessageEl.innerHTML = 'EUREKA!!!';
      appMessageEl.classList.add('eureka');

      // for (const card of cardsUp) {
      //   setInterval(card.classList.add('card--hidden'), 3000);
      // }
      console.dir(cardsDown);
    } else {
      appMessageEl.innerHTML = '';
      console.log('no coinciden');
    }
  } else {
    console.log('más de una carta boca arriba');
  }
}

function requestApi(URL) {
  fetch(`${URL}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(responsedParsed) {
      cardsFromAPI = responsedParsed;
      drawCards(cardsFromAPI);
      return cardsFromAPI;
    })
    .then(function(data) {
      const cardsEls = document.querySelectorAll('.card');
      for (const element of cardsEls) {
        element.addEventListener('click', handlerCardsClick);
      }
      console.log(cardsFromAPI);
    });
}

function saveOnLS(key, value) {
  localStorage.setItem(key, value);
}

function retrieveFromLS(key) {
  const infoSavedOnLS = parseInt(localStorage.getItem(key));

  if (infoSavedOnLS) {
    NUMBER = infoSavedOnLS;
    for (const element of inputsRadioEls) {
      const elementNumber = parseInt(element.getAttribute('data-number'));
      if (elementNumber === NUMBER) {
        element.setAttribute('checked', 'true');
      }
    }
  }
}

//Handlers
function handlerStartClick(event) {
  event.preventDefault();
  let userChoiceEl = '';

  //Get user election
  for (const element of inputsRadioEls) {
    element.checked ? (userChoiceEl = element) : '';
  }
  NUMBER = parseInt(userChoiceEl.getAttribute('data-number'));

  let URL = `https://raw.githubusercontent.com/Adalab/cards-data/master/${NUMBER}.json`;

  saveOnLS('userChoice', NUMBER);
  requestApi(URL);
}

//Init
function init() {
  retrieveFromLS('userChoice');
  btnStartEl.addEventListener('click', handlerStartClick);
}
init();

//# sourceMappingURL=main.js.map
