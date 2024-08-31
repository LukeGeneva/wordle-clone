let guess = '';
let gameState;
const statusClassMap = {
  correct: 'green',
  incorrect: 'dark-gray',
  'wrong-position': 'yellow',
};

document.addEventListener('DOMContentLoaded', async () => {
  gameState = await fetchGameState();
  const keys = document.querySelectorAll('.key');
  keys.forEach((key) => key.addEventListener('click', () => onKeyClick(key)));
  renderGameState();
  renderKeyboard();
});

async function fetchGameState() {
  const response = await fetch('/game/state');
  const state = await response.json();
  return state;
}

function onKeyClick(key) {
  const innerHTML = key.innerHTML;
  if (innerHTML === 'ENTER') {
    onEnterClick();
    return;
  }

  if (innerHTML === 'BACK') {
    onDeleteClick();
    return;
  }

  if (guess.length === 5) return;

  guess = guess + key.innerHTML;
  renderGameState();
}

async function onEnterClick() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch('/attempt', {
    body: JSON.stringify({ attempt: guess }),
    method: 'POST',
    headers,
  });
  guess = '';
  gameState = await response.json();
  renderGameState();
  renderKeyboard();
}

function onDeleteClick() {
  guess = guess.slice(0, guess.length - 1);
  renderGameState();
}

function renderGameState() {
  for (let i = 0; i < gameState.attempts.length; i++) {
    const rowIndex = i + 1;
    const row = document.querySelector(`.board .row:nth-child(${rowIndex})`);
    for (let j = 0; j < 5; j++) {
      const result = gameState.attempts[i][j];
      const cell = row.querySelector(`.cell:nth-child(${j + 1})`);
      cell.innerHTML = result.letter;
      const className = statusClassMap[result.status];
      cell.className += ` ${className}`;
    }
  }

  let rowIndex = gameState.attempts.length + 1;
  const row = document.querySelector(`.board .row:nth-child(${rowIndex})`);
  for (let i = 0; i < 5; i++) {
    const char = guess[i] || '';
    const cell = row.querySelector(`.cell:nth-child(${i + 1})`);
    cell.innerHTML = char;
  }
}

function renderKeyboard() {
  const statuses = {};
  for (let attempt of gameState.attempts) {
    for (let result of attempt) {
      statuses[result.letter] = result.status;
    }
  }

  const keys = Array.from(document.querySelectorAll('.key').values());
  for (let letter of Object.keys(statuses)) {
    const key = keys.find((k) => k.innerHTML === letter);
    const className = statusClassMap[statuses[letter]];
    if (!className) continue;
    key.className += ` ${statusClassMap[statuses[letter]]}`;
  }
}
