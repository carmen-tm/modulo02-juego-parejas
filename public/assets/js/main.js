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
  console.log('click');
  listResultsEl.innerHTML = '';
  //Paint as many cards as the user choice
  for (const element of array) {
    const itemEl = document.createElement('li');

    const divFaceEl = document.createElement('div');
    divFaceEl.classList.add('card', 'card--face');
    const divBackEl = document.createElement('div');
    divBackEl.classList.add('card', 'card--back');

    itemEl.appendChild(divFaceEl);
    itemEl.appendChild(divBackEl);
    listResultsEl.appendChild(itemEl);
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
    });
}

function saveOnLS(key, value) {
  localStorage.setItem(key, value);
}

function retrieveFromLS(key) {
  const infoSavedOnLS = parseInt(localStorage.getItem(key));
  console.log(infoSavedOnLS);

  if (infoSavedOnLS) {
    NUMBER = infoSavedOnLS;
    for (const element of inputsRadioEls) {
      const elementNumber = parseInt(element.getAttribute('data-number'));
      if (elementNumber === NUMBER) {
        console.log(element);
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
