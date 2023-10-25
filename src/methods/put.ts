import { AxiosResponse } from 'axios';
import { HttpClient } from '../client';
import { Cancellable } from '../cancellable';
import { DefaultExceptionHandler } from '../errors/error-handler';

export class PutMethod<TBody, TResponse> extends Cancellable {
  protected async send(endpoint: string, body: TBody): Promise<TResponse> {
    try {
      const response = await HttpClient.getInstance().getPrivateInstance().put<TBody, AxiosResponse<TResponse>>(endpoint, body, { signal: this.getSignal() });
      return response.data;
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  protected async sendWithoutToken(endpoint: string, body: TBody): Promise<TResponse> {
    try {
      const response = await HttpClient.getInstance().getPublicInstance().put<TBody, AxiosResponse<TResponse>>(endpoint, body, { signal: this.getSignal() });
      return response.data;
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  public static build<TBody, TResponse>(): PutMethodBuilder<TBody, TResponse> {
    return new PutMethodBuilder<TBody, TResponse>();
  }
}

class PutMethodBuilder<TBody, TResponse> extends PutMethod<TBody, TResponse> {
  public send(endpoint: string, body: TBody): Promise<TResponse> {
    return super.send(endpoint, body);
  }

  public sendWithoutToken(endpoint: string, body: TBody): Promise<TResponse> {
    return super.sendWithoutToken(endpoint, body);
  }
}
