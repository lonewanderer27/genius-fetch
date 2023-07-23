import Bottleneck from 'bottleneck';

export type LimiterOptions = Bottleneck.ConstructorOptions;

export default class Limiter {

  #limiter: Bottleneck;
  #enabled: boolean;

  constructor(options = {}) {
    this.#limiter = new Bottleneck(options);
    this.#enabled = true;
  }

  isEnabled() {
    return this.#enabled;
  }

  setEnabled(value: boolean) {
    this.#enabled = value;
  }

  schedule<T>(fn: () => PromiseLike<T>) {
    if (this.isEnabled()) {
      return this.#limiter.schedule(fn);
    }

    return fn();

  }

  setOptions(options: LimiterOptions) {
    this.#limiter.updateSettings(options);
  }
}
