import axios, { AxiosInstance } from 'axios';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { HttpClientDefinition, HttpClientType } from '../types';

export class HttpClient {
  private instances: Map<HttpClientType, AxiosInstance> = new Map();
  private instancesConfigs: Map<HttpClientType, HttpClientDefinition> = new Map();

  public async register(name: HttpClientType, options: HttpClientDefinition) {
    if (this.instances.has(name)) return;
    this.instancesConfigs.set(name, options);
    const newInstance = axios.create({
      headers: options.headers,
      beforeRedirect: options.beforeRedirect,
      baseURL: process.env.NEXT_PUBLIC_BASE_API,
    });
    this.instances.set(name, this.addTokenInterceptor(newInstance, options));
  }

  public get(name: HttpClientType): AxiosInstance {
    if (!this.instances.has(name)) throw new Error(`HttpClient ${name} not found`);
    return this.instances.get(name)!;
  }

  public getInstance(name: HttpClientType): AxiosInstance {
    if (!this.instances.has(name)) throw new Error(`HttpClient ${name} not found`);
    return this.instances.get(name)!;
  }

  public getPrivateInstance(): AxiosInstance {
    return this.getInstance('PRIVATE');
  }

  public getPublicInstance(): AxiosInstance {
    return this.getInstance('PUBLIC');
  }

  // Internal Utils

  protected addTokenInterceptor(instance: AxiosInstance, configs: HttpClientDefinition): AxiosInstance {
    const onFulfilled = (request: any) => {
      const token = configs.getToken();
      if (token) request.headers['Authorization'] = 'Bearer ' + token;
      return request;
    };

    const onRejected = () => {
      const error = new UnauthorizedError();
      configs.onUnauthorized(error);
      return Promise.reject(error);
    };

    instance.interceptors.request.use(onFulfilled, onRejected);

    const onFulfilled2 = (val: any) => Promise.resolve(val);

    const onRejected2 = (error: any) => {
      if (error.response && error.response.status) {
        if ([401, 403].includes(error.response.status)) {
          configs.onUnauthorized(error);
        }
      }
      return Promise.reject(error);
    };

    instance.interceptors.response.use(onFulfilled2, onRejected2);

    return instance;
  }

  private static instance: HttpClient;

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) HttpClient.instance = new HttpClient();
    return HttpClient.instance;
  }
}
