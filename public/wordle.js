let guess = '';
let gameState = {
  attempts: [],
};

document.addEventListener('DOMContentLoaded', () => {
  const keys = document.querySelectorAll('.key');
  keys.forEach((key) => key.addEventListener('click', () => onKeyClick(key)));
});

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
}

function onDeleteClick() {
  guess = guess.slice(0, guess.length - 1);
  renderGameState();
}

function renderGameState() {
  const rowIndex = gameState.attempts.length + 1;
  const row = document.querySelector(`.board .row:nth-child(${rowIndex})`);
  for (let i = 0; i < 5; i++) {
    const char = guess[i] || '';
    const cell = row.querySelector(`.cell:nth-child(${i + 1})`);
    cell.innerHTML = char;
  }
}
