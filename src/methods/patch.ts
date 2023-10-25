import { HttpError } from '../errors';
import { BaseHttpMethod } from './base';
import { AxiosInstance, AxiosResponse } from 'axios';

export class PatchMethod<TBody, TResponse> extends BaseHttpMethod {
  protected async send(endpoint: string, body: TBody): Promise<TResponse> {
    try {
      const response = await this.instance.patch<TBody, AxiosResponse<TResponse>>(endpoint, body, { signal: this.getSignal() });
      return response.data;
    } catch (error) {
      throw HttpError.catch(error);
    }
  }

  public static build<TBody, TResponse>(instance: AxiosInstance): PatchMethodBuilder<TBody, TResponse> {
    return new PatchMethodBuilder<TBody, TResponse>(instance);
  }
}

class PatchMethodBuilder<TBody, TResponse> extends PatchMethod<TBody, TResponse> {
  public send(endpoint: string, body: TBody): Promise<TResponse> {
    return super.send(endpoint, body);
  }
}
