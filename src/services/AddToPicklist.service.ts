import Request from './Request';
import { getEnvironment, Environment } from '../utils/environment';

export default class AddToPicklistService {
  public static addToPicklist(payload: {headers: object; itemNumber: number}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/picklist`,
      method: 'post',
      data: {
        itemNbr: payload.itemNumber
      },
      headers: payload.headers
    });
  }
}
