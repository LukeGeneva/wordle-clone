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
  for (let i = 0; i < gameState.attempts.length; i++) {
    const rowIndex = i + 1;
    const row = document.querySelector(`.board .row:nth-child(${rowIndex})`);
    for (let j = 0; j < 5; j++) {
      const letter = gameState.attempts[i][j].letter;
      const inWord = gameState.attempts[i][j].inWord;
      const inPosition = gameState.attempts[i][j].inPosition;
      const cell = row.querySelector(`.cell:nth-child(${j + 1})`);
      cell.innerHTML = letter;
      if (inPosition) cell.className += ' green';
      else if (inWord) cell.className += ' yellow';
      else cell.className += ' dark-gray';
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
