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
    itemEl.classList.add('item-card');

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
  const selectedItemEl = event.currentTarget;
  const selectedCardFaceEl = selectedItemEl.firstChild;
  selectedCardFaceEl.classList.toggle('card--hidden');
  const selectedCardBackEl = selectedItemEl.lastChild;
  selectedCardBackEl.classList.toggle('card--hidden');

  const selectedCardPairId = parseInt(
    selectedItemEl.firstChild.getAttribute('data-pair')
  );

  //Instructions just to be applied when one card is already up. Condition??
  const cardsUp = [];
  const allCardsFaceEls = document.querySelectorAll('.card--face');

  for (const card of allCardsFaceEls) {
    if (card.classList.contains('card--hidden')) {
      // console.log('card down');
    } else {
      cardsUp.push(card);
    }
  }
  console.log(allCardsFaceEls);
  console.log(cardsUp);

  const numberOfCardsUp = cardsUp.length;
  console.log(numberOfCardsUp);

  if (numberOfCardsUp === 1) {
    console.log(selectedCardPairId);
    pairCards = [];
    pairCards[0] = selectedCardPairId;
    appMessageEl.innerHTML = 'busca su pareja!!';
  } else if (numberOfCardsUp === 2) {
    pairCards[1] = selectedCardPairId;
    console.log('solo hay una carta boca arriba');
    if (pairCards[0] === pairCards[1]) {
      //Print message on HTML
      appMessageEl.innerHTML = 'EUREKA!!!';
      appMessageEl.classList.add('eureka');
      pairCards = [];

      console.log(cardsUp);
      for (const card of cardsUp) {
        card.style.transform = 'scale(1.2)';
        setInterval(function() {
          card.classList.add('card--hidden');
          card.nextSibling.classList.remove('card--hidden');
          card.style.transform = 'scale(1)';
          appMessageEl.innerHTML = '';
          appMessageEl.classList.remove('eureka');
        }, 3000);
      }
    } else if (numberOfCardsUp === 3) {
      pairCards = [];
      appMessageEl.innerHTML = 'upsss';
      for (const card of cardsUp) {
        setInterval(function() {
          card.classList.add('card--hidden');
          card.nextSibling.classList.remove('card--hidden');
          appMessageEl.innerHTML = '';
        }, 1000);
        console.log('no coinciden');
      }
    }
  } else {
    pairCards = [];
    appMessageEl.innerHTML = '';
    for (const card of cardsUp) {
      setInterval(function() {
        card.classList.add('card--hidden');
        card.nextSibling.classList.remove('card--hidden');
        appMessageEl.innerHTML = '';
      }, 1000);
      console.log('más de una carta boca arriba');
    }
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

      const cardsItemsEls = document.querySelectorAll('.item-card');
      for (const element of cardsItemsEls) {
        element.addEventListener('click', handlerCardsClick);
      }
      return cardsFromAPI;
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
