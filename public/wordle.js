let guess = '';
let gameState;
const statusClassMap = {
  correct: 'green',
  incorrect: 'dark-gray',
  'wrong-position': 'yellow',
};

document.addEventListener('DOMContentLoaded', async () => {
  gameState = await fetchGameState();
  document.addEventListener('keydown', onKeyDown);
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

async function onKeyDown(e) {
  if (gameState.status !== 'in-progress') return;
  if (e.code === 'Enter') return onEnterClick();
  if (e.code === 'Backspace') return onDeleteClick();
  if (!/Key[A-Z]/.test(e.code)) return;
  if (guess.length === 5) return;
  guess += e.code.replace('Key', '').toLowerCase();
  renderGameState();
}

function onKeyClick(key) {
  if (gameState.status !== 'in-progress') return;

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
  if (rowIndex <= 6) {
    const row = document.querySelector(`.board .row:nth-child(${rowIndex})`);
    for (let i = 0; i < 5; i++) {
      const char = guess[i] || '';
      const cell = row.querySelector(`.cell:nth-child(${i + 1})`);
      cell.innerHTML = char;
    }
  }

  if (gameState.status === 'in-progress') {
    return;
  }
  showEndGameModal();
}

function showEndGameModal() {
  const endGameModal = document.getElementById('end-game-modal');
  endGameModal.className += ' modal-visible';

  const endGameMessage = document.getElementById('end-game-message');
  const win = gameState.status === 'win';
  endGameMessage.innerHTML = win
    ? 'Nice Work!'
    : gameState.answer.toUpperCase();
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
