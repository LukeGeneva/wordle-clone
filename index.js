const express = require('express');
const cookieParser = require('cookie-parser');
const { words } = require('./words');

const app = express();
app.use(cookieParser());
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.json());

app.post('/game', (req, res) => {
  const index = Math.floor(Math.random() * words.length);
  const word = words[index];
  const state = { answer: word, attempts: [] };
  res.cookie('state', JSON.stringify(state));
  return res.redirect('/game');
});

app.post('/attempt', (req, res) => {
  const attempt = req.body.attempt;
  console.log('BODY', req.body);
  const state = JSON.parse(req.cookies.state);
  console.log('ATTEMPT', attempt);
  state.attempts.push(attempt);
  res.cookie('state', JSON.stringify(state));
  console.log('STATE', state);
  return res.json(state);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000.');
});
