import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { ApprovalListItem } from '../models/ApprovalListItem';

export default class UpdateOHQtyService {
  public static updateOHQty(payload: {
    data: ApprovalListItem;
    worklistType?: string;
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    const { data, worklistType } = payload;
    return Request.post(
      `${urls.orchestrationURL}/managerapproval/items`,
      data,
      { headers: worklistType ? { worklistType } : undefined }
    );
  }
}
