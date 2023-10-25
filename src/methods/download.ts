import { HttpError } from '../errors';
import { ProgressiveFileMethod } from './abstract-progressive-file';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class DownloadFileMethod extends ProgressiveFileMethod {
  protected async send(endpoint: string): Promise<AxiosResponse<Blob>> {
    try {
      return this.instance.get<Blob>(endpoint, this.getConfigs()).finally(() => this.setWasResolved());
    } catch (error) {
      throw HttpError.catch(error);
    }
  }

  private getConfigs(): AxiosRequestConfig<Blob> {
    return {
      responseType: 'blob',
      signal: this.ensureSignal(),
      onDownloadProgress: this.onProgress,
    };
  }

  public static build(instance: AxiosInstance): DownloadFileMethodBuilder {
    return new DownloadFileMethodBuilder(instance);
  }
}

class DownloadFileMethodBuilder extends DownloadFileMethod {
  public send(endpoint: string): Promise<AxiosResponse<Blob>> {
    return super.send(endpoint);
  }
}
