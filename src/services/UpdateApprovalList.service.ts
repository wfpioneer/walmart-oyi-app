import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { ApprovalListItem, approvalAction } from '../models/ApprovalListItem';

const TIMEOUT = 30000; // ms

export default class UpdateApprovalListService {
  public static updateApprovalList(
    payload:{approvalItems: ApprovalListItem[], headers: {action: approvalAction}}
  ): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();

    return Request.put(
      `${urls.managerApprovalUrl}/managerapproval/items`,
      payload.approvalItems,
      {
        headers: payload.headers,
        timeout: TIMEOUT
      }
    );
  }
}
