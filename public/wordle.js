let gameState = {
  attempt: 1,
  guess: '',
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

  if (gameState.guess.length === 5) return;

  gameState = { ...gameState, guess: gameState.guess + key.innerHTML };
  renderGameState();
}

async function onEnterClick() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch('/attempt', {
    body: JSON.stringify({ attempt: gameState.guess }),
    method: 'POST',
    headers,
  });
  const state = await response.json();
  console.log(state);
}

function onDeleteClick() {
  gameState = {
    ...gameState,
    guess: gameState.guess.slice(0, gameState.guess.length - 1),
  };
  renderGameState();
}

function renderGameState() {
  const rowIndex = gameState.attempt;
  const row = document.querySelector(`.board .row:nth-child(${rowIndex})`);
  for (let i = 0; i < 5; i++) {
    const char = gameState.guess[i] || '';
    const cell = row.querySelector(`.cell:nth-child(${i + 1})`);
    cell.innerHTML = char;
  }
}
