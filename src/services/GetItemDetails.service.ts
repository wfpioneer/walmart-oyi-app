import Request from './Request';

export default class GetItemDetailsService {
  public static getItemDetails(payload: {headers: object}) {
    return Request.enqueue({
      url: 'https://www.google.com',
      method: 'get',
      timeout: 10000,
      headers: payload.headers
    });
  }
}
