import { AxiosInstance } from 'axios';
import { Cancellable } from '../cancellable';

export abstract class BaseHttpMethod extends Cancellable {
  protected instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    super();
    this.instance = instance;
  }
}
