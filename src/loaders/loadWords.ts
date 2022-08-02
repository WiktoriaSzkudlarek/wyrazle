import { readFileSync } from 'fs';

export const loadWordsAsObject = (src: string): { [key: string]: true } => {
  const splittedWords = readFileSync(src, 'utf-8')
    .split('\n')
    .filter((word) => word.length === 5);

  const obj = {};
  splittedWords.forEach((word) => {
    obj[word] = true;
  });

  return obj;
};

export const loadWordsAsArray = (src: string) => {
  const arr = readFileSync(src, 'utf-8')
    .split('\n')
    .filter((word) => word.length === 5);

  return arr;
};
