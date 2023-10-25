import { HttpError } from '../errors';
import axios, { AxiosInstance } from 'axios';
import { ErrorInfo, HttpClientDefinition } from '../types';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export class HttpClient<InstanceType> {
  private instances: Map<InstanceType, AxiosInstance> = new Map();
  private instancesConfigs: Map<InstanceType, HttpClientDefinition> = new Map();

  public register(name: InstanceType, options: HttpClientDefinition): Pick<HttpClient<InstanceType>, 'register'> {
    this.instancesConfigs.set(name, options);
    const newInstance = axios.create({
      baseURL: options.baseURL,
      headers: options.headers,
      beforeRedirect: options.beforeRedirect,
    });
    this.instances.set(name, this.addTokenInterceptor(newInstance, options));
    return this;
  }

  public getInstance(name: InstanceType): AxiosInstance {
    if (!this.instances.has(name)) {
      throw new Error(`HttpClient "${name}" not found. Register it by using "Http.register" or use one of the previous registered one: [${Array.from(this.instances.keys()).map(String)}]`);
    }
    return this.instances.get(name)!;
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

  public static parseError(error: any): ErrorInfo {
    return HttpError.parse(error);
  }

  // Initialization

  private static instance: HttpClient<any>;

  private constructor() {}

  public static getOrCreateInstance<InstanceType>(): HttpClient<InstanceType> {
    if (!HttpClient.instance) HttpClient.instance = new HttpClient();
    return HttpClient.instance;
  }
}
