import { HandlerMeta } from './type';
import pin from './pin';
import unpin from './unpin';
import sendPin from './sendPin';

export const meta: Array<HandlerMeta> = [
  pin,
  unpin,
  sendPin,
];

export default meta;
