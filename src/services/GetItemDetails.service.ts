import Request from './Request';

export default class GetItemDetailsService {
  public static getItemDetails(payload: {headers: object; id: number}) {
    return Request.enqueue({
      url: `https://intl-oyi-item-details-api.dev.walmart.com/item/${payload.id}`,
      method: 'get',
      timeout: 10000,
      headers: payload.headers
    });
  }
}
