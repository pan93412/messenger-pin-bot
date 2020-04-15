import { HandlerMeta, metaWhen } from './type';

export const meta: HandlerMeta = {
  when: metaWhen.onMessage,
  handler: (api, db, _, message) => {
    if (message) {
      const msg = message as Facebook.IReceivedMessage;

      if (db.shouldSend(msg.threadID)) {
        api.sendMessage(
          `[置底] ${db.get(msg.threadID)}`,
          msg.threadID,
          () => {},
        );
      }
    }
  },
};

export default meta;
