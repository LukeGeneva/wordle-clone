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

function onEnterClick() {
  console.log('ENTER');
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
