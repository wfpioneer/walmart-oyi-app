import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { ApprovalListItem, approvalAction } from '../models/ApprovalListItem';

// TODO rename to something shorter if possible
export default class SubmitApprovalListService {
  public static SubmitApprovalList(payload: {action: approvalAction, approvalItems: ApprovalListItem[]}) {
    const urls: Environment = getEnvironment();

    return Request.put(
      `${urls.managerApprovalUrl}/managerapproval/items`,
      payload.approvalItems,
      {
        headers: { action: payload.action }
      }
    );
  }
}
