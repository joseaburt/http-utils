import { HttpError } from '../errors';
import { BaseHttpMethod } from './base';
import { AxiosInstance, AxiosResponse } from 'axios';

export class PutMethod<TBody, TResponse> extends BaseHttpMethod {
  protected async send(endpoint: string, body: TBody): Promise<TResponse> {
    try {
      const response = await this.instance.put<TBody, AxiosResponse<TResponse>>(endpoint, body, { signal: this.getSignal() });
      return response.data;
    } catch (error) {
      throw HttpError.catch(error);
    }
  }

  public static build<TBody, TResponse>(instance: AxiosInstance): PutMethodBuilder<TBody, TResponse> {
    return new PutMethodBuilder<TBody, TResponse>(instance);
  }
}

class PutMethodBuilder<TBody, TResponse> extends PutMethod<TBody, TResponse> {
  public send(endpoint: string, body: TBody): Promise<TResponse> {
    return super.send(endpoint, body);
  }
}
