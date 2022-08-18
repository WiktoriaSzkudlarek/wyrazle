interface Props {
  value: string;
  color: string;
  onClick(letter: string): void;
}

export const Button = ({ value, color, onClick }: Props) => {
  return (
    <button
      style={{ background: color, color: value === '<--' ? '#fff' : '#2f2f2f' }}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};
