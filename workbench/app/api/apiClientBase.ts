import { Fetcher } from "./fetcher";

export abstract class ApiClientBase {

  protected baseUrl = "https://api.spotify.com/v1";

  private fetchAuthToken(): string{
    return "Your authorization token";
  }

  protected sendJson<T, R>(method: string, authorization: boolean, url: string, payload?: T): Promise<IFetchApiResponse<R>> {
    return Fetcher.sendJson<T, R>(method, `${this.baseUrl}${url}`, payload, authorization ? this.fetchAuthToken() : null)
  }
  protected sendForm<T, R>(method: string, authorization: boolean, url: string, payload?: T): Promise<IFetchApiResponse<R>> {
    return Fetcher.sendForm<T, R>(method, `${this.baseUrl}${url}`, payload, authorization ? this.fetchAuthToken() : null)
  }
}