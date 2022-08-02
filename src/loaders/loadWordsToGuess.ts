import { loadWordsAsArray } from './loadWords';
import { random } from 'lodash';

const wordsToGuessPath = './static/words_to_guess.txt' as string;
export const loadWordsToGuess = () => loadWordsAsArray(wordsToGuessPath);

export const getRandomWord = (src: string[]) => {
  return src[random(src.length - 1)];
};
