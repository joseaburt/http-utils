import { AxiosInstance } from 'axios';
import { HttpError } from '../errors';
import { BaseHttpMethod } from './base';

export class GetMethod<TResponse> extends BaseHttpMethod {
  protected async send(endpoint: string): Promise<TResponse> {
    try {
      const response = await this.instance.get<TResponse>(endpoint, { signal: this.ensureSignal() });
      return response.data;
    } catch (error) {
      throw HttpError.catch(error);
    }
  }

  public static build<TResponse>(instance: AxiosInstance): GetMethodBuilder<TResponse> {
    return new GetMethodBuilder<TResponse>(instance);
  }
}

class GetMethodBuilder<TResponse> extends GetMethod<TResponse> {
  public send(endpoint: string): Promise<TResponse> {
    return super.send(endpoint);
  }
}
