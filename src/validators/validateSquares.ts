import { times } from 'lodash';

export enum ValidationResult {
  Win = 'win',
  Fail = 'fail',
  Ongoing = 'ongoing'
}

export const validateSquares = (
  squaresArray: string[],
  numberOfAttempts: number
): ValidationResult => {
  const lastSquares = squaresArray[squaresArray.length - 1];
  if (lastSquares === '🟩🟩🟩🟩🟩') return ValidationResult.Win;
  if (numberOfAttempts === 5) return ValidationResult.Fail;
  return ValidationResult.Ongoing;
};
