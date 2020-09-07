import Request from './Request';

export default class GetItemDetailsService {
  public static getItemDetails(payload: {headers: object; id: number}) {
    return Request.enqueue({
      url: `/item/${payload.id}`,
      method: 'get',
      timeout: 10000,
      headers: payload.headers
    });
  }
}
