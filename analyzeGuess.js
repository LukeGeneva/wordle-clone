function analyzeGuess(guess, answer) {
  const results = [];
  const taken = new Array(answer.length).fill(false);

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
    results.push({
      letter: guess[i],
      status: getStatus(guess[i], i),
    });
  }

  return results;
}

module.exports = { analyzeGuess };
