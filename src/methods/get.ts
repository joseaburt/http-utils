import { HttpClient } from '../client';
import { Cancellable } from '../cancellable';
import { DefaultExceptionHandler } from '../errors/error-handler';

export class GetMethod<TResponse> extends Cancellable {
  protected async send(endpoint: string): Promise<TResponse> {
    try {
      const response = await HttpClient.getInstance().getPrivateInstance().get<TResponse>(endpoint, { signal: this.ensureSignal() });
      return response.data;
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  protected async sendWithoutToken(endpoint: string): Promise<TResponse> {
    try {
      const response = await HttpClient.getInstance().getPrivateInstance().get<TResponse>(endpoint, { signal: this.ensureSignal() });
      return response.data;
    } catch (error) {
      throw DefaultExceptionHandler.new().catch(error);
    }
  }

  public static build<TResponse>(): GetMethodBuilder<TResponse> {
    return new GetMethodBuilder<TResponse>();
  }
}

class GetMethodBuilder<TResponse> extends GetMethod<TResponse> {
  public send(endpoint: string): Promise<TResponse> {
    return super.send(endpoint);
  }

  public sendWithoutToken(endpoint: string): Promise<TResponse> {
    return super.sendWithoutToken(endpoint);
  }
}
