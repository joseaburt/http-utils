export class UnauthorizedError extends Error {
  public code: string;
  constructor(message = 'UnauthorizedError') {
    super(message);
    this.name = 'UnauthorizedError';
    this.code = 'Unauthorized';
  }
}
