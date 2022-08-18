import './styles.css';
import { Keyboard } from 'components/Keyboard';
import { Field } from 'components/Field';
import { useState, useEffect } from 'react';
import GraphemeSplitter from 'grapheme-splitter';
import queryString from 'query-string';

function App() {
  useEffect(() => {
    // @ts-ignore
    window.Telegram.WebApp.ready();
    // @ts-ignore
    window.Telegram.WebApp.expand();
    setTimeout(() => {
      // @ts-ignore
      window.Telegram.WebApp.expand();
    }, 100);
  }, []);

  const [words, setWords] = useState<string[][]>(() => {
    const parsed = queryString.parse(window.location.search);
    if (!parsed.words) return [];

    const decodedWords = decodeURIComponent(parsed.words as string);
    const wordsArray = JSON.parse(decodedWords) as string[];

    return wordsArray.map(word => word.split(''));
  });

  const [squares, setSquares] = useState<string[][]>(() => {
    const parsed = queryString.parse(window.location.search);
    if (!parsed.squares) return [];

    const decodedSquares = decodeURIComponent(parsed.squares as string);

    const squaresArray = JSON.parse(decodedSquares) as string[];
    console.log(squaresArray);
    const splitter = new GraphemeSplitter();

    return squaresArray.map(word => splitter.splitGraphemes(word));
  });

  const [newWord, setNewWord] = useState<string[]>([]);
  const handleLetterClick = (letter: string) => {
    // @ts-ignore
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
    if (letter === '<--') {
      const newWordArray = [...newWord];
      newWordArray.pop();
      setNewWord(newWordArray);
    } else {
      if (newWord.length === 4) {
        // @ts-ignore
        window.Telegram.WebApp.sendData([...newWord, letter].join(''));
        // @ts-ignore
        window.Telegram.WebApp.close();
      }
      setNewWord([...newWord, letter]);
    }

    console.log(newWord);
  };

  return (
    <main>
      <Field words={words} squares={squares} newWord={newWord} />
      <Keyboard words={words} squares={squares} onClick={handleLetterClick} />
    </main>
  );
}

export default App;
