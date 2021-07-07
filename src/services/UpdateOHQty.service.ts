import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { ApprovalListItem } from '../models/ApprovalListItem';

export default class UpdateOHQtyService {
  public static updateOHQty(payload: { data: ApprovalListItem}): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/managerapproval/items`,
      payload.data,
    );
  }
}
