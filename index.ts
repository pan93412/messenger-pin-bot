// Imports
import login from 'facebook-chat-api';
import readline from 'readline';
import process from 'process';
import {
  config as dotconf,
} from 'dotenv';
import Db from './db';
import modList from './handlers';

dotconf();
const { env } = process;
const email = env.FB_EMAIL || '';
const password = env.FB_PWD || '';
const maxTimes = Number(env.MAX_TIMES) || 5;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const pinDb = new Db(maxTimes);

login({
  email,
  password,
}, (
  err: Facebook.ILoginError,
  api: Facebook.API,
) => {
  if (err) {
    switch (err.error) {
      case 'login-approval':
        rl.question('請輸入 2FA 碼: ', (ans: string) => {
          if (err.continue) err.continue(ans);
          rl.close();
        });
        break;

      default:
        console.error(err);
    }
    return;
  }

  api.setOptions({ selfListen: true });
  api.listenMqtt((lerr, message) => {
    if (lerr) {
      console.error(lerr);
      return;
    }
    if (!message) return;

    const msg = message as Facebook.IReceivedMessage;

    modList.forEach((m) => {
      const match: RegExpMatchArray | null = (m.match && msg.body)
        ? msg.body.match(m.match)
        : null;

      m.handler(
        api,
        pinDb,
        match,
        msg,
        err,
      );
    });
  });
});
