import { BaseHttpMethod } from './base';
import { Optional, ProgressSubscriber } from '../types';
import { AxiosInstance, AxiosProgressEvent } from 'axios';

export abstract class ProgressiveFileMethod extends BaseHttpMethod {
  private subscriber: Optional<ProgressSubscriber>;

  constructor(instance: AxiosInstance) {
    super(instance);
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
