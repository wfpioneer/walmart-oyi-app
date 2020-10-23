import Request from './Request';
import { getEnvironment, Environment } from "../utils/environment";

export default class AddToPicklistService {
  public static addToPicklist(payload: {headers: object; itemNumber: number}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.itemDetailsURL}/picklist`,
      method: 'post',
      data: {
        itemNbr: payload.itemNumber
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
