import PinDB from '../db';

export enum metaWhen {
  onMessage = 'onmessage',
  onNonMessage = 'onnonmessage',
  onAll = 'onall',
}

export interface HandlerFunc {
  (
    api: Facebook.API,
    db: PinDB,
    match?: RegExpMatchArray | null,
    message?: Facebook.IReceived | Facebook.IReceivedMessage,
    err?: Facebook.IError
  ): void;
}

export interface HandlerMeta {
  when: metaWhen; // currently no implements
  handler: HandlerFunc;
  match?: RegExp;
}

export default {
  metaWhen,
};
