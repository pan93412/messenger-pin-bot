import { HandlerMeta, metaWhen } from './type';

export const meta: HandlerMeta = {
  when: metaWhen.onMessage,
  handler: (match, api, db, message) => {
    if (match[1] && message) {
      const msg = message as Facebook.IReceivedMessage;

      db.set(msg.threadID, match[1]);
      api.sendMessage(
        `[Bot] ${msg.senderID} 置底了一則訊息。`,
        msg.threadID,
        () => {},
      );
    }
  },
  match: /^(?:#pin|#置底) (.+)$/,
};

export default meta;
