export interface ApiErrorSource {
  path: string;
  message: string;
}

export class ApiError extends Error {
  statusCode: number;
  errorSources: ApiErrorSource[];

  constructor(
    statusCode: number,
    message: string,
    errorSources: ApiErrorSource[] = [],
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorSources = errorSources;
    if (stack) {
      this.stack = stack;
    }
  }
}
