import { Button } from 'components/Button';

interface Props {
  words: string[][];
  squares: string[][];
  onClick(letter: string): void;
}

const keys = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  '<--',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'ą',
  'ć',
  'ę',
  'ł',
  'ń',
  'ó',
  'ś',
  'ź',
  'ż',
];

export const Keyboard = ({ words, squares, onClick }: Props) => {
  return (
    <div className="keyboard">
      {keys.map((letter, index) => {
        return (
          <>
            <Button
              value={letter}
              color={getColor(letter, words, squares)}
              key={letter}
              onClick={onClick}
            />
          </>
        );
      })}
    </div>
  );
};

function getColor(letter: string, words: string[][], squares: string[][]) {
  if (letter === '<--') return '#8d5650';

  let funnyColor = '#b89a71';
  words.forEach((word, index) => {
    word.forEach((wordLetter, colIndex) => {
      if (wordLetter === letter && squares[index][colIndex] === '🟩')
        funnyColor = '#649a5f';
      if (
        wordLetter === letter &&
        squares[index][colIndex] === '🟨' &&
        funnyColor !== '#649a5f'
      )
        funnyColor = '#EFDF6E';
      if (wordLetter === letter && funnyColor === '#b89a71')
        funnyColor = '#B9B4AC';
    });
  });

  return funnyColor;
}
