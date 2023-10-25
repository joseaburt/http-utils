import { HttpClient } from '../client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DefaultExceptionHandler } from '../errors/error-handler';
import { ProgressiveFileMethod } from './abstract-progressive-file';

export class DownloadFileMethod extends ProgressiveFileMethod {
  protected async send(endpoint: string): Promise<AxiosResponse<Blob>> {
    try {
      return HttpClient.getInstance()
        .getPrivateInstance()
        .get<Blob>(endpoint, this.getConfigs())
        .finally(() => this.setWasResolved());
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  protected async sendWithoutToken(endpoint: string): Promise<AxiosResponse<Blob>> {
    try {
      return HttpClient.getInstance()
        .getPublicInstance()
        .get<Blob>(endpoint, this.getConfigs())
        .finally(() => this.setWasResolved());
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  private getConfigs(): AxiosRequestConfig<Blob> {
    return {
      responseType: 'blob',
      signal: this.ensureSignal(),
      onDownloadProgress: this.onProgress,
    };
  }

  public static build(): DownloadFileMethodBuilder {
    return new DownloadFileMethodBuilder();
  }
}

class DownloadFileMethodBuilder extends DownloadFileMethod {
  public send(endpoint: string): Promise<AxiosResponse<Blob>> {
    return super.send(endpoint);
  }

  public sendWithoutToken(endpoint: string): Promise<AxiosResponse<Blob>> {
    return super.sendWithoutToken(endpoint);
  }
}
