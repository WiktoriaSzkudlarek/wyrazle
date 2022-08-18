interface Props {
  words: string[][];
  squares: string[][];
  newWord: string[];
}

export const Field = ({ words, squares, newWord }: Props) => {
  return (
    <div className="field">
      {words.map((word, index) => {
        return (
          <div className="wordField" key={index}>
            {word.map((letter, colIndex) => {
              return (
                <span
                  className="letterField"
                  key={`${index}${colIndex}`}
                  style={{ background: getColor(squares[index][colIndex]) }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        );
      })}

      {
        <div className="wordField" key={'newWord'}>
          {newWord.map((letter, colIndex) => {
            return (
              <span
                className="letterField"
                key={`${letter}${colIndex}`}
                style={{ background: '#6f8a8a' }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      }
    </div>
  );
};

function getColor(square: string) {
  if (square === '⬜️') return '#B9B4AC';
  if (square === '🟨') return '#EFDF6E';
  return '#649a5f';
}
