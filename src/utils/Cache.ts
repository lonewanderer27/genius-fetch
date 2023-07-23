import NodeCache from 'node-cache';

export default class Cache {

  #ttl: {
    [type: string]: number;
  };
  #maxEntries: {
    [type: string]: number;
  };
  #cache: NodeCache;
  #enabled: boolean;
  #debug: boolean;

  constructor(ttl: { [type: string]: number; } = {}, maxEntries: { [type: string]: number; } = {}) {
    this.#ttl = ttl;
    this.#maxEntries = maxEntries;
    this.#cache = new NodeCache({
      checkperiod: 600
    });
    this.#enabled = true;
    this.#debug = false;
  }

  setTTL(type: string, ttl: number) {
    this.#debugMessage(`[genius-fetch-cache] Set TTL=${ttl}`);
    if (this.#ttl[type] != ttl) {
      const keys = this.getKeys(type);
      for (const key of keys) {
        this.#cache.ttl(key, ttl);
      }
      this.#debugMessage(`[genius-fetch-cache] Updated TTL of ${keys.length} entries to ${ttl}s`);
    }
    this.#ttl[type] = ttl;
  }

  setMaxEntries(type: string, maxEntries: number) {
    this.#reduceEntries(type, maxEntries);
    this.#maxEntries[type] = maxEntries;
    this.#debugMessage(`[genius-fetch-cache] Set max entries to ${maxEntries}`);
  }

  getMaxEntries(type: string) {
    return this.#maxEntries[type] !== undefined ? this.#maxEntries[type] : -1;
  }

  isEnabled() {
    return this.#enabled;
  }

  setEnabled(value: boolean) {
    this.#enabled = value;
  }

  get<T>(type: string, key: string): T | undefined {
    if (!this.isEnabled()) {
      return undefined;
    }
    return this.#cache.get(`${type}.${key}`);
  }

  put<T>(type: string, key: string, value: T) {
    if (!this.isEnabled()) {
      return;
    }
    const maxEntries = this.getMaxEntries(type);
    if (maxEntries === 0) {
      return false;
    }
    else if (maxEntries > 0) {
      this.#reduceEntries(type, maxEntries - 1);
    }
    this.#debugMessage(`[genius-fetch-cache] Saving cache entry; key='${key}'`);
    return this.#cache.set(`${type}.${key}`, value, this.#ttl[type]);
  }

  #reduceEntries(type: string, reduceTo: number) {
    if (reduceTo === undefined) {
      reduceTo = this.getMaxEntries(type);
    }
    if (reduceTo < 0) {
      return;
    }
    const keys = this.getKeys(type);
    if (keys.length > reduceTo) {
      for (let i = 0; i < keys.length - reduceTo; i++) {
        this.#cache.del(keys[i]);
      }
    }
  }

  getKeys(type: string) {
    return this.#cache.keys().filter((key) => key.startsWith(`${type}.`));
  }

  clear(type: string) {
    if (!type) {
      this.#cache.flushAll();
    }
    else {
      this.getKeys(type).forEach((key) => {
        this.#cache.del(key);
      });
    }
    this.#debugMessage('[genius-fetch-cache] Cache cleared');
  }

  setDebug(value: boolean) {
    this.#debug = value;
  }

  async getOrSet<T>(type: string, key: string, promiseCallback: () => Promise<T>): Promise<T> {
    if (!this.isEnabled()) {
      return promiseCallback();
    }
    const cachedValue = this.get<T>(type, key);
    if (cachedValue !== undefined) {
      this.#debugMessage(`[genius-fetch-cache] Returning cached value for key '${key}'`);
      return cachedValue;
    }

    return promiseCallback().then((value) => {
      this.put(type, key, value);
      return value;
    });
  }

  #debugMessage(msg: string) {
    if (this.#debug) {
      console.log(msg);
    }
  }
}
