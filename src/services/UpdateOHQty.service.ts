import Request from './Request';

export default class UpdateOHQtyService {
  public static updateOHQty(payload: {
    headers: object;
    itemNumber: number;
    data: {
      onHandQty: number;
    };
  }) {
    return Request.enqueue({
      url: `https://intl-oyi-item-details-api.dev.walmart.com/item/${payload.itemNumber}/onhands`,
      method: 'put',
      timeout: 10000,
      headers: payload.headers,
      data: payload.data
    });
  }
}
