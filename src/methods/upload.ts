import { HttpClient } from '../client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DefaultExceptionHandler } from '../errors/error-handler';
import { ProgressiveFileMethod } from './abstract-progressive-file';

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
      return HttpClient.getInstance()
        .getPrivateInstance()
        .post<T>(endpoint, formData, this.getConfigs())
        .finally(() => this.setWasResolved());
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  protected async sendWithoutToken(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> {
    try {
      return HttpClient.getInstance()
        .getPrivateInstance()
        .post<T>(endpoint, formData, this.getConfigs())
        .finally(() => this.setWasResolved());
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  public static build<T = any>(): UploadFileMethodBuilder<T> {
    return new UploadFileMethodBuilder<T>();
  }
}

class UploadFileMethodBuilder<T = any> extends UploadFileMethod<T> {
  public send(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> {
    return super.send(endpoint, formData);
  }

  public sendWithoutToken(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> {
    return super.sendWithoutToken(endpoint, formData);
  }
}
