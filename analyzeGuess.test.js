const { analyzeGuess } = require('./analyzeGuess');

test('that guess is fully correct', () => {
  expect(analyzeGuess('aaaaa', 'aaaaa')).toEqual([
    { letter: 'a', status: 'correct' },
    { letter: 'a', status: 'correct' },
    { letter: 'a', status: 'correct' },
    { letter: 'a', status: 'correct' },
    { letter: 'a', status: 'correct' },
  ]);
});

test('that letters can be incorrect', () => {
  expect(analyzeGuess('aaaaa', 'bbbbb')).toEqual([
    { letter: 'a', status: 'incorrect' },
    { letter: 'a', status: 'incorrect' },
    { letter: 'a', status: 'incorrect' },
    { letter: 'a', status: 'incorrect' },
    { letter: 'a', status: 'incorrect' },
  ]);
});

test('that letters can be in wrong position', () => {
  expect(analyzeGuess('abcde', 'bcdea')).toEqual([
    { letter: 'a', status: 'wrong-position' },
    { letter: 'b', status: 'wrong-position' },
    { letter: 'c', status: 'wrong-position' },
    { letter: 'd', status: 'wrong-position' },
    { letter: 'e', status: 'wrong-position' },
  ]);
});

test('that letters is wrong position are not reported more times than they appear in answer', () => {
  expect(analyzeGuess('balls', 'slabs')).toEqual([
    { letter: 'b', status: 'wrong-position' },
    { letter: 'a', status: 'wrong-position' },
    { letter: 'l', status: 'wrong-position' },
    { letter: 'l', status: 'incorrect' },
    { letter: 's', status: 'correct' },
  ]);
});
