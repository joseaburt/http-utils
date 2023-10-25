import { HttpError } from '../errors';
import { BaseHttpMethod } from './base';
import { AxiosInstance, AxiosResponse } from 'axios';

export class DeleteMethod<TResponse = void> extends BaseHttpMethod {
  protected async send(endpoint: string): Promise<AxiosResponse<TResponse>> {
    try {
      return await this.instance.delete<TResponse>(endpoint, { signal: this.ensureSignal() });
    } catch (error) {
      throw HttpError.catch(error);
    }
  }

  public static build(instance: AxiosInstance): DeleteMethodBuilder {
    return new DeleteMethodBuilder(instance);
  }
}

export class DeleteMethodBuilder extends DeleteMethod<void> {
  public send(endpoint: string): Promise<AxiosResponse<void>> {
    return super.send(endpoint);
  }
}
