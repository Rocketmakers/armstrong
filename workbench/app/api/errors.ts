declare type IError = Error;

export module CustomErrors {
  declare class Error implements IError {
    name: string;
    message: string;
    stack: string;
    static captureStackTrace(object, objectConstructor?);
  }

  abstract class CustomError extends Error {
    constructor(public name: string, public message: string, public internalMessage?: string) {
      super();
    }
  }

  export class ApiError extends CustomError implements IFetchApiFailure {
    constructor(message: string, response: IFetchApiResponse<any>) {
      super("ApiError", message);
      this.text = response.text;
      this.json = response.json;
      this.response = response.response;
      if (response.response.status === 422) {
        const resp: IValidationErrorResponse = response.json;
        this.validations = resp ? resp.errors : undefined;
      }
    }
    text: string;
    json: any;
    validations: IValidationError[];
    response: { status: number };
  }

  export class NetworkError extends CustomError implements IFetchApiFailure {
    public text: string;
    public json: any;
    public response: { status: number };

    constructor(){
      super("NetworkError", "A Network Error occurred");

      this.response = { status: 0 };
    }
  }
}
