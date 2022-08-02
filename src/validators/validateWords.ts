import { times } from 'lodash';

export const validateWords = (correctWord: string, guessedWord: string) => {
  if (correctWord === guessedWord) {
    return times(5, () => '🟩');
  }

  const correctWordAsArray = correctWord.split('');
  const guessedWordAsArray = guessedWord.split('');
  const resultArray = new Array(5);

  guessedWordAsArray.forEach((letter, index) => {
    const letterPosition = correctWordAsArray.indexOf(letter);
    if (guessedWordAsArray[letterPosition] === letter) {
      guessedWordAsArray[index] = '';
      correctWordAsArray[letterPosition] = '';
      resultArray[index] = '🟩';
    }
  });

  guessedWordAsArray.forEach((letter, index) => {
    const letterPosition = correctWordAsArray.indexOf(letter);
    if (resultArray[index] === '🟩') {
      return;
    }
    if (letterPosition > 0) {
      guessedWordAsArray[index] = '';
      correctWordAsArray[letterPosition] = '';
      resultArray[index] = '🟨';
    } else resultArray[index] = '⬜️';
  });

  return resultArray;
};
