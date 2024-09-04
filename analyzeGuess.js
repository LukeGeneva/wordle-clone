function analyzeGuess(guess, answer) {
  const results = new Array(answer.length);
  const taken = new Array(answer.length).fill(false);

  // TODO: this is duplicate logic. Clean this up.
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      taken[i] = true;
      results[i] = {
        letter: guess[i],
        status: 'correct',
      };
    }
  }

  const getStatus = (letter, index) => {
    if (letter === answer[index]) {
      taken[index] = true;
      return 'correct';
    }

    for (let i = 0; i < answer.length; i++) {
      if (index === i) continue;
      if (letter !== answer[i]) continue;
      if (!taken[i]) {
        taken[i] = true;
        return 'wrong-position';
      }
    }

    return 'incorrect';
  };

  for (let i = 0; i < guess.length; i++) {
    results[i] = {
      letter: guess[i],
      status: getStatus(guess[i], i),
    };
  }

  return results;
}

module.exports = { analyzeGuess };
