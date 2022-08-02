import internal from 'stream';
import { Telegraf } from 'telegraf';
import { loadWordsToGuess, getRandomWord } from './loaders/loadWordsToGuess';
import { loadWordsToVerify, verifyWord } from './loaders/loadWordsToVerify';
import { validateWords } from './validators/validateWords';
import {
  validateSquares,
  ValidationResult
} from './validators/validateSquares';

const bot = new Telegraf('');
bot.start((ctx) => ctx.reply('Wyrazle'));
bot.help((ctx) => ctx.reply('/nowagra => zaczyna gre'));
// bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const wordsToGuess = loadWordsToGuess();
//const dailyWord = getRandomWord(wordsToGuess);
const wordsToVerify = loadWordsToVerify();
const gameStates = {} as {
  [key: string]: {
    wordToGuess: string;
    validatedSquaresArray: string[];
    numberOfAttempts: number;
  };
};

bot.hears('/nowagra', (ctx) => {
  ctx.reply('Podaj 5 literowe słowo');
  gameStates[ctx.message.chat.id] = {
    wordToGuess: getRandomWord(wordsToGuess),
    //wordToGuess: 'polak',
    validatedSquaresArray: [],
    numberOfAttempts: 0
  };
});

bot.on('message', (ctx) => {
  const usersWord = ctx.message.text?.trim();
  if (!usersWord) return;
  const wordToGuess = gameStates[ctx.message.chat.id]?.wordToGuess;

  if (!wordToGuess) {
    ctx.reply('Gra nie została rozpoczęta');
    gameStates.splice;
    return;
  }
  if (!verifyWord(wordsToVerify, usersWord)) {
    ctx.reply('Nie ma takiego słowa w słowniku 5 literowym');
    return;
  }

  gameStates[ctx.message.chat.id].numberOfAttempts++; //

  const validatedSquares = validateWords(wordToGuess, usersWord).join('');
  gameStates[ctx.message.chat.id].validatedSquaresArray.push(validatedSquares);

  const numberOfAttempts = gameStates[ctx.message.chat.id].numberOfAttempts;
  const validatedSquaresArray =
    gameStates[ctx.message.chat.id].validatedSquaresArray;

  const progressMessage =
    numberOfAttempts + '/5\n\n' + validatedSquaresArray.join('\n');
  ctx.reply(progressMessage);

  console.log(`"${wordToGuess}"`);

  const gameStatus = validateSquares(validatedSquaresArray, numberOfAttempts);
  switch (gameStatus) {
    case ValidationResult.Win:
      ctx.reply('Wygranko :)');
      delete gameStates[ctx.message.chat.id];
      break;
    case ValidationResult.Fail:
      ctx.reply('Przegranko :(');
      delete gameStates[ctx.message.chat.id];
      break;
  }
});
