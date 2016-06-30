declare interface RmConfig {
  getEnvironment: () => 'development' | 'production';
}

declare const rmConfig : RmConfig

interface IApiErrorResponse {
  message: string;
}

interface IValidationErrorResponse extends IApiErrorResponse {
  errors: IValidationError[];
}

interface IValidationError {
  message: string;
  attribute: string;
  value: any;
}

interface IFetchApiContent<T> {
  text?: string;
  json?: T;
}

interface IFetchResponse {
  status: number;
}

interface IFetchApiResponse<T> extends IFetchApiContent<T> {
  response: IFetchResponse;
}

interface IFetchApiFailure extends IFetchApiContent<any> {
  response: IFetchResponse;
  validations?: IValidationError[];
}

