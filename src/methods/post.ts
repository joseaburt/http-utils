import { HttpError } from '../errors';
import { BaseHttpMethod } from './base';
import { AxiosInstance, AxiosResponse } from 'axios';

export class PostMethod<TBody, TResponse> extends BaseHttpMethod {
  protected async send(endpoint: string, body: TBody): Promise<TResponse> {
    try {
      const response = await this.instance.post<TBody, AxiosResponse<TResponse>>(endpoint, body, { signal: this.getSignal() });
      return response.data;
    } catch (error) {
      throw HttpError.catch(error);
    }
  }

  public static build<TBody, TResponse>(instance: AxiosInstance): PostMethodBuilder<TBody, TResponse> {
    return new PostMethodBuilder<TBody, TResponse>(instance);
  }
}

export class PostMethodBuilder<TBody, TResponse> extends PostMethod<TBody, TResponse> {
  public send(endpoint: string, body: TBody): Promise<TResponse> {
    return super.send(endpoint, body);
  }
}
