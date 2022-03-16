import { AxiosRequestHeaders } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class AddToPicklistService {
  public static addToPicklist(payload: {
    headers?: AxiosRequestHeaders;
    itemNumber: number;
  }) {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/picklist`,
      { itemNbr: payload.itemNumber },
      { headers: payload.headers }
    );
  }
}
