interface MessagePinDB {
  msg: string;
  timer: number;
}

interface MessageMainDB {
  [key: string]: MessagePinDB;
}

export default class PinDB {
  #db: MessageMainDB = {};

  #maxMsg: number;

  constructor(maxMsg = 5) {
    this.#maxMsg = maxMsg;
  }

  set(threadID: string, message: string): void {
    this.#db[threadID] = {
      msg: message,
      timer: 0,
    };
  }

  get(threadID: string): string {
    return this.#db[threadID].msg;
  }

  remove(threadID: string): void {
    delete this.#db[threadID];
  }

  /**
   * 收到某 threadID 的訊息請執行一次。
   *
   * @param threadID 討論串 ID
   * @return 如果是 true 則代表應該要傳送置底訊息了。
   * 反之，回傳 false。
   */
  shouldSend(threadID: string): boolean {
    let returnAs = false;
    if (this.#db[threadID].timer >= this.#maxMsg) {
      returnAs = true;
      this.#db[threadID].timer = 0;
    } else this.#db[threadID].timer += 1;
    return returnAs;
  }
}
