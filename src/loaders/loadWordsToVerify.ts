import { loadWordsAsObject } from './loadWords';

const wordsToGuessPath = './static/words_to_verify.txt' as string;
export const loadWordsToVerify = () => loadWordsAsObject(wordsToGuessPath);

export const verifyWord = (src: { [key: string]: true }, word: string) => {
  return word in src;
};
