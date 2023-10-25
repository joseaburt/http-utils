import _ from 'lodash';
import { AxiosError } from 'axios';
import { CreateErrorOption, ErrorInfo } from '../types';

export class HttpError extends Error {
  public readonly context: any;
  public readonly code: string;
  public readonly status: number;

  constructor(status: number, code: string, message: string, context?: any) {
    super(message);
    this.context = context;
    this.code = code;
    this.status = status;
  }

  public static create(options: CreateErrorOption): HttpError {
    return new HttpError(options.status, options.code, options.message, options.context);
  }

  public static catch(error: any) {
    return this.ensure(error);
  }

  private static ensure(error: any): HttpError {
    if (error instanceof HttpError) return error;

    let payload = {
      statusCode: 0,
      error: error.name,
      message: error.message,
      code: _.get(error, 'code', ''),
    };

    if (error instanceof AxiosError && error.response && error.response.data) {
      payload = { ...payload, ...error.response.data };
    }

    return new HttpError(payload.statusCode, payload.code, payload.message, payload);
  }

  public static parse(error: any): ErrorInfo {
    const err = this.ensure(error);
    const status = 'status' in err ? (err.status as number) : 500;
    const message = 'message' in err ? (err.message as any) : '';
    const code = 'code' in err ? (err.code as string) : 'ServerError';
    return { code, message, status, context: error };
  }
}
