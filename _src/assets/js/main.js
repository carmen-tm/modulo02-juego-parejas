/* eslint-disable no-console */
'use strict';

//Get elements
const inputsRadioEls = document.querySelectorAll('.number-cards__button');
const btnStartEl = document.querySelector('.btn-start');
const listResultsEl = document.querySelector('.app-results');

let NUMBER = '';
let cardsFromAPI = [];

//Functions
function drawCards(array) {
  listResultsEl.innerHTML = '';
  //Paint as many cards as the user choice
  for (const element of array) {
    const cardImageUrl = element.image;
    console.log(cardImageUrl);

    const itemEl = document.createElement('li');
    const divFaceEl = document.createElement('div');
    divFaceEl.style.backgroundImage = `url(${cardImageUrl})`;
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
      console.log(cardsEls);
      for (const element of cardsEls) {
        element.addEventListener('click', handlerCardsClick);
      }
      // console.log(data, cardsEls);
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
