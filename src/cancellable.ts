import { Abortable } from './types';

export abstract class Cancellable implements Abortable {
  protected abortController: AbortController;
  protected wasResolved: boolean = false;

  constructor() {
    this.abortController = new AbortController();
    this.abort = this.abort.bind(this);
  }

  protected initController(): void {
    this.abortController.abort();
    this.abortController = new AbortController();
    this.wasResolved = false;
  }

  public abort(): void {
    if (!this.wasResolved) {
      this.abortController.abort();
    }
  }

  protected getSignal(): AbortSignal {
    return this.abortController.signal;
  }

  protected ensureSignal(): AbortSignal {
    this.initController();
    return this.getSignal();
  }

  protected setWasResolved(): void {
    this.wasResolved = true;
  }
}
