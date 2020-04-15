// config
const TIMES = 5;

const login = require('facebook-chat-api');
const readline = require('readline');
const process = require('process');

const env = (() => {
  require('dotenv').config();
  return require('process').env;
})();
const account = {
  email: env.FB_EMAIL,
  password: env.FB_PWD,
};

/**
 * architect
 *
 * threadID: {
 *   msg: pinMessage,
 *   timer: 0
 * }
 */
const toSend = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

login({ ...account }, (err, api) => {
  if (err) {
    switch (err.error) {
      case 'login-approval':
        console.log('請輸入 2FA Code > ');
        rl.on('line', (line) => {
          err.continue(line);
          rl.close();
        });
        break;
      default:
        console.error(err);
    }
    return;
  }

  process.stdout.write('\x1bc'); // cls

  api.setOptions({ selfListen: true });
  api.listenMqtt((err, message) => {
    if (err) console.error(err);
    if (!message || !message.body) return;

    const { body } = message;
    const bodyMatch = body.match(/^(#pin|#unpin) (.+)$/);

    if (bodyMatch && bodyMatch[1] === '#pin' && bodyMatch[2]) {
      toSend[message.threadID] = { msg: bodyMatch[2], timer: 0 };
      api.sendMessage(`[Bot] ${message.senderID} 置頂了 ${toSend[message.threadID].msg}。`, message.threadID);
    } else if (bodyMatch && bodyMatch[1] === '#unpin' && bodyMatch[2]) {
      delete toSend[message.threadID];
      api.sendMessage(`[Bot] ${message.senderID} 已取消置頂，理由：${bodyMatch[2]}`, message.threadID);
    } else if (toSend[message.threadID]) {
      const m = toSend[message.threadID];
      if (m.timer === TIMES) {
        api.sendMessage(`[置頂] ${m.msg}`, message.threadID);
        toSend[message.threadID].timer = 0;
      } else toSend[message.threadID].timer++;
    }
  });
});
