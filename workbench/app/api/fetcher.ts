import * as _ from "underscore";
import {CustomErrors} from "./errors";

window.fetch = null;
import "whatwg-fetch";

/**
Sample implementation of IApiClient using ES6 fetch
*/
export class Fetcher {

  /**
   Send a request to the Api via 'fetch'
   @param method The Http Method
   @param url The Request Url
   @param payload The Request Payload
   @param authToken The authorization bearer token
   */
  static sendHead(url: string, authToken: string = null): Promise<Response> {
    const init = { method: "HEAD" }
    if (authToken) {
      Fetcher.addAuthHeader(init, authToken);
    }

    return Fetcher.fetch(url, init);
  }

  /**
  Send a request to the Api via 'fetch'
  @param method The Http Method
  @param url The Request Url
  @param payload The Request Payload
  @param authToken The authorization bearer token
  */
  static sendJson<T, R>(method: string, url: string, payload?: T, authToken: string = null): Promise<IFetchApiResponse<R>> {

    let p = payload ? JSON.stringify(payload) : null;
    let init: any = Fetcher.requestInit(method, p, "application/json");
    if (authToken) {
      Fetcher.addAuthHeader(init, authToken);
    }

    return Fetcher.fetchJson<R>(url, init);
  }

  /**
  Send a form encoded request to the Api via 'fetch'
  @param method The Http Method
  @param url The Request Url
  @param payload The Request Payload
  @param authToken The authorization bearer token
  */
  static sendForm<T, R>(method: string, url: string, payload?: T, authToken: string = null): Promise<IFetchApiResponse<R>> {
    var p = payload ? Fetcher.postFormPayload(payload) : undefined;
    var init: any = Fetcher.requestInit(method, p, "application/x-www-form-urlencoded");
    if (authToken) {
      Fetcher.addAuthHeader(init, authToken)
    }

    return Fetcher.fetchJson<R>(url, init);
  }

  private static fetch(url: string, init: any): Promise<Response> {
    return <any>fetch(url, init).catch(() => {
      throw new CustomErrors.NetworkError();
    });
  }

  private static fetchJson<R>(url: string, init: any): Promise<IFetchApiResponse<R>> {
    return Fetcher.fetch(url, init).then(r =>
        Fetcher.getContent<R>(r).then(content => {
          let response:IFetchApiResponse<R> = {response: r};
          if (content.text) {
            response.text = content.text;
          }
          if (content.json) {
            response.json = content.json;
          }
          if (r.status >= 400) {
            throw new CustomErrors.ApiError("Invalid Status Code", response)
          }
          return response;
        }));
  }

  private static getContent<T>(r: Response): Promise<IFetchApiContent<T>> {
    const contentType = r.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") > -1) {
      return r.json().then((json) => {
        return { json: json }
      });
    }

    if (contentType && contentType.indexOf("text/html") > -1) {
      return r.text().then((text: string) => {
        return { text: text }
      });
    }

    return Promise.resolve({});
  }

  private static addAuthHeader(init: any, token: string) {
    init.headers = init.headers || <any> {};
    init.headers['Authorization'] = `Bearer ${token}`;
  }

  private static postFormPayload<T>(entity: T): string {
    return _.reduce<string, string>(_.keys(entity), (m, key) => {
      var item = `${key}=${encodeURIComponent(entity[key]) }`;
      if (m) {
        return `${m}&${item}`;
      }
      return item;
    }, "");
  }

  private static requestInit(method: string = "GET", payload: string = null, contentType?: string): any {
    let init: any = {
      method,
      headers: {
        'Content-Type': contentType
      }
    };
    if (payload) {
      init.body = payload;
    }

    return init;
  }
}
