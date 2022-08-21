import config from './config.json';
import { Telegraf } from 'telegraf';
import { loadWordsToGuess, getRandomWord } from './loaders/loadWordsToGuess';
import { loadWordsToVerify, verifyWord } from './loaders/loadWordsToVerify';
import { validateWords } from './validators/validateWords';
import {
  validateSquares,
  ValidationResult,
} from './validators/validateSquares';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { Message } from 'telegraf/typings/core/types/typegram';

const bot = new Telegraf(config.token);
bot.start(ctx => ctx.reply('Wyrazle\n/nowagra => zaczyna gre'));
bot.help(ctx => ctx.reply('/nowagra => zaczyna gre'));
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
    validatedWordsArray: string[];
    numberOfAttempts: number;
  };
};

bot.hears('/nowagra', ctx => {
  delete gameStates[ctx.message.chat.id];
  replyMessage(ctx, 'Podaj 5 literowe słowo', {
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Otwórz klawiaturę',
            web_app: {
              url: `https://WiktoriaSzkudlarek.github.io/wyrazle?words=${encodeURIComponent(
                JSON.stringify(
                  gameStates[ctx.message.chat.id]?.validatedWordsArray ?? [],
                ),
              )}&squares=${encodeURIComponent(
                JSON.stringify(
                  gameStates[ctx.message.chat.id]?.validatedSquaresArray ?? [],
                ),
              )}`,
            },
          },
        ],
      ],
    },
  });
  gameStates[ctx.message.chat.id] = {
    wordToGuess: getRandomWord(wordsToGuess).toLowerCase(),
    validatedSquaresArray: [],
    validatedWordsArray: [],
    numberOfAttempts: 0,
  };
});

bot.on('message', ctx => {
  const usersWord =
    ctx.webAppData?.data.text() ?? ctx.message.text?.trim().toLowerCase();
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

  gameStates[ctx.message.chat.id].numberOfAttempts++;

  const validatedSquares = validateWords(wordToGuess, usersWord).join('');
  gameStates[ctx.message.chat.id].validatedSquaresArray.push(validatedSquares);

  const numberOfAttempts = gameStates[ctx.message.chat.id].numberOfAttempts;

  const validatedSquaresArray =
    gameStates[ctx.message.chat.id].validatedSquaresArray;

  gameStates[ctx.message.chat.id].validatedWordsArray.push(usersWord);

  const progressMessage =
    numberOfAttempts + '/5\n\n' + validatedSquaresArray.join('\n');
  replyMessage(ctx, progressMessage, {
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Otwórz klawiaturę',
            web_app: {
              url: `https://WiktoriaSzkudlarek.github.io/wyrazle?words=${encodeURIComponent(
                JSON.stringify(
                  gameStates[ctx.message.chat.id]?.validatedWordsArray ?? [],
                ),
              )}&squares=${encodeURIComponent(
                JSON.stringify(
                  gameStates[ctx.message.chat.id]?.validatedSquaresArray ?? [],
                ),
              )}`,
            },
          },
        ],
      ],
    },
  });

  console.log(`"${wordToGuess}"`);
  console.log(
    `https://WiktoriaSzkudlarek.github.io/wyrazle?words=${encodeURIComponent(
      JSON.stringify(
        gameStates[ctx.message.chat.id]?.validatedWordsArray ?? [],
      ),
    )}&squares=${encodeURIComponent(
      JSON.stringify(
        gameStates[ctx.message.chat.id]?.validatedSquaresArray ?? [],
      ),
    )}`,
  );

  const gameStatus = validateSquares(validatedSquaresArray, numberOfAttempts);
  switch (gameStatus) {
    case ValidationResult.Win:
      ctx.reply('Wygranko :)', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      delete gameStates[ctx.message.chat.id];
      break;
    case ValidationResult.Fail:
      ctx.reply(`Przegranko :(\nPoprawne słowo: ${wordToGuess}`, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      delete gameStates[ctx.message.chat.id];
      break;
  }
});

function replyMessage(
  ctx: {
    reply(
      text: string,
      extra?: ExtraReplyMessage,
    ): Promise<Message.TextMessage>;
  },
  message: string,
  extra?: ExtraReplyMessage,
) {
  ctx.reply(message, extra).catch(() => ctx.reply(message));
}
