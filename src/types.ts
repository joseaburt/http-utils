import { Cancellable } from './cancellable';
import { UnauthorizedError } from './errors';
import { RawAxiosRequestHeaders, AxiosHeaders, HeadersDefaults, AxiosProgressEvent } from 'axios';

export type QueryState = {
  sorts: Record<string, any>;
  params: Record<string, any>;
  filters: Record<string, any>;
};

export type Meta = {
  page: number;
  total: number;
  pageSize: number;
};

export type Query = Partial<QueryState>;

export type BackendResponse<T> = {
  data: T;
  meta: Meta;
};

export type BackendErrorResponse = {
  code: string;
  error: string;
  message: string;
  statusCode: number;
};

export interface Abortable {
  abort(): void;
}

export type WithAbortResponse<TResponse> = {
  abort: () => void;
  response: BackendResponse<TResponse>;
};

export interface ExceptionHandler<R = any> {
  catch(error: Error): R;
}

export type ErrorPayload = {
  code: string;
  error: string;
  message: string;
  statusCode: number;
};

export type Optional<T> = T | undefined | null;
export type ProgressSubscriberArgs = { progress: number; event: AxiosProgressEvent };
export type ProgressSubscriber = (args: ProgressSubscriberArgs) => void;

export abstract class AbstractPaginableRepository extends Cancellable {
  abstract getAll<T>(baseURL: string, query: Query): Promise<BackendResponse<T[]>>;
}

// Client

export type HttpClientType = 'PRIVATE' | 'PUBLIC';

export type HttpClientDefinition = {
  baseURL?: string;
  getToken: () => string | undefined;
  onSessionExpired(error: Error): void;
  onUnauthorized: (error: UnauthorizedError) => void;
  headers?: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults>;
  beforeRedirect?: (options: Record<string, any>, responseDetails: { headers: Record<string, string> }) => void;
};
