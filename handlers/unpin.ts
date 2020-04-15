import { HandlerMeta, metaWhen } from './type';

export const meta: HandlerMeta = {
  when: metaWhen.onMessage,
  handler: (api, db, match, message) => {
    if (match && match[1] && message) {
      const msg = message as Facebook.IReceivedMessage;

      db.remove(msg.threadID);
      api.sendMessage(
        `[Bot] ${msg.senderID} 取消了置底訊息。`,
        msg.threadID,
        () => {},
      );
    }
  },
  match: /^(?:#unpin|#取消置底)$/,
};

export default meta;
