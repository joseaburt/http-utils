import _ from 'lodash';
import { AxiosError } from 'axios';
import { ExceptionHandler } from '../types';
import HttpError from '@joseaburt/http-error';

export class DefaultExceptionHandler implements ExceptionHandler {
  public catch(error: any) {
    let payload = {
      statusCode: 0,
      error: error.name,
      message: error.message,
      code: _.get(error, 'code', ''),
    };

    if (error instanceof AxiosError && error.response && error.response.data) {
      payload = { ...payload, ...error.response.data };
    }

    if (error instanceof HttpError) {
      payload = {
        code: error.code,
        error: error.name,
        message: error.message,
        statusCode: error.status,
      };
    }

    return new HttpError(payload.statusCode, payload.code, payload.message, payload);
  }

  private static instance: DefaultExceptionHandler | undefined;

  private constructor() {}

  public static new(): DefaultExceptionHandler {
    if (!this.instance) this.instance = new DefaultExceptionHandler();
    return this.instance;
  }
}
