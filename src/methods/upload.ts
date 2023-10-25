import { HttpError } from '../errors';
import { ProgressiveFileMethod } from './abstract-progressive-file';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class UploadFileMethod<T = any> extends ProgressiveFileMethod {
  private getConfigs(): AxiosRequestConfig<Blob> {
    return {
      signal: this.ensureSignal(),
      onUploadProgress: this.onProgress,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  protected async send(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> {
    try {
      return this.instance.post<T>(endpoint, formData, this.getConfigs()).finally(() => this.setWasResolved());
    } catch (error) {
      throw HttpError.catch(error);
    }
  }

  public static build<T = any>(instance: AxiosInstance): UploadFileMethodBuilder<T> {
    return new UploadFileMethodBuilder<T>(instance);
  }
}

class UploadFileMethodBuilder<T = any> extends UploadFileMethod<T> {
  public send(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> {
    return super.send(endpoint, formData);
  }
}
