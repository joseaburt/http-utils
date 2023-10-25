import { AxiosProgressEvent } from 'axios';
import { Cancellable } from '../cancellable';
import { Optional, ProgressSubscriber } from '../types';

export abstract class ProgressiveFileMethod extends Cancellable {
  private subscriber: Optional<ProgressSubscriber>;

  constructor() {
    super();
    this.onProgress = this.onProgress.bind(this);
  }

  public subscribeToProgress(subscriber: ProgressSubscriber): Omit<ProgressiveFileMethod, 'onDownloadProgress'> {
    this.subscriber = subscriber;
    return this;
  }

  protected onProgress(progress: AxiosProgressEvent) {
    const total = progress?.total ?? 0;
    const percentCompleted = Math.round((progress.loaded * 100) / total);
    if (this?.subscriber) {
      this.subscriber({ progress: percentCompleted, event: progress });
    }
  }
}
