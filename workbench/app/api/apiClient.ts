import { ApiClientBase } from './apiClientBase';

class ApiClient extends ApiClientBase {
    public searchForArtist(query?: string, type?: string): Promise<IFetchApiResponse<any>> {
        return this.sendJson("GET", false, `/search?query=${query}&type=${type || 'artist'}`)
    }
}

export default new ApiClient();