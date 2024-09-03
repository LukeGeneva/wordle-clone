const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { words } = require('./words');
const { analyzeGuess } = require('./analyzeGuess');
const { decrypt, encrypt } = require('./crypto');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const INITIALIZATION_VECTOR = process.env.INITIALIZATION_VECTOR;

const encryptCookie = encrypt(SECRET_KEY, INITIALIZATION_VECTOR);
const decryptCookie = decrypt(SECRET_KEY, INITIALIZATION_VECTOR);

const app = express();
app.use(cookieParser());
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.json());

app.get('/game/state', [decryptGameState], (req, res) => {
  const state = req.gameState;
  delete state.answer;
  return res.json(state);
});

app.post('/game', (req, res) => {
  const index = Math.floor(Math.random() * words.length);
  const word = words[index];
  const state = { answer: word, attempts: [] };
  const encryptedState = encryptCookie(JSON.stringify(state));
  res.cookie('state', encryptedState);
  return res.redirect('/game');
});

app.post('/attempt', [decryptGameState], (req, res) => {
  const attempt = req.body.attempt;
  if (attempt.length !== 5) {
    return res.status(400).send('Attempt must be a 5-letter word.');
  }

  const state = req.gameState;
  const result = analyzeGuess(attempt, state.answer);
  state.attempts.push(result);
  const encryptedState = encryptCookie(JSON.stringify(state));
  res.cookie('state', encryptedState);

  delete state.answer;
  return res.json(state);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000.');
});

function decryptGameState(req, res, next) {
  const encryptedCookie = req.cookies.state;

  if (encryptedCookie) {
    try {
      const decryptedState = decryptCookie(encryptedCookie);
      req.gameState = JSON.parse(decryptedState);
      return next();
    } catch (error) {
      console.error('Failed to decrypt cookie:', error);
      return res.status(400).send('Invalid cookie');
    }
  } else {
    return res.status(401).send('No game state cookie found');
  }
}
