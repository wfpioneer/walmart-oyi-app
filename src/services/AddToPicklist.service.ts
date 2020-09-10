import Request from './Request';

export default class AddToPicklistService {
  public static addToPicklist(payload: {headers: object; itemNumber: number}) {
    return Request.enqueue({
      url: 'https://intl-oyi-item-details-api.dev.walmart.com/picklist',
      method: 'post',
      data: {
        itemNbr: payload.itemNumber
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
