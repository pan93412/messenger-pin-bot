import PinDB from '../db';

export enum metaWhen {
  onMessage = 'onmessage',
  onNonMessage = 'onnonmessage',
  onAll = 'onall',
}

export interface HandlerFunc {
  (
    match: RegExpMatchArray,
    api: Facebook.API,
    db: PinDB,
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
