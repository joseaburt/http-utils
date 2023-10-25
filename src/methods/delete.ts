import { AxiosResponse } from 'axios';
import { HttpClient } from '../client';
import { Cancellable } from '../cancellable';
import { DefaultExceptionHandler } from '../errors/error-handler';

export class DeleteMethod<TResponse = void> extends Cancellable {
  protected async send(endpoint: string): Promise<AxiosResponse<TResponse>> {
    try {
      return await HttpClient.getInstance().getPrivateInstance().delete<TResponse>(endpoint, { signal: this.ensureSignal() });
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  protected async sendWithoutToken(endpoint: string): Promise<AxiosResponse<TResponse>> {
    try {
      return await HttpClient.getInstance().getPublicInstance().delete<TResponse>(endpoint, { signal: this.ensureSignal() });
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  public static build(): DeleteMethodBuilder {
    return new DeleteMethodBuilder();
  }
}

export class DeleteMethodBuilder extends DeleteMethod<void> {
  public send(endpoint: string): Promise<AxiosResponse<void>> {
    return super.send(endpoint);
  }

  public sendWithoutToken(endpoint: string): Promise<AxiosResponse<void>> {
    return super.send(endpoint);
  }
}
