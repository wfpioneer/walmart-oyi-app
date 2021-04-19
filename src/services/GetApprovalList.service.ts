import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { approvalRequestSource, approvalStatus } from '../models/ApprovalListItem';

export default class GetApprovalListService {
  public static getApprovalList(
    payload: {itemNbr?: number; status?: approvalStatus; approvalRequestSource?: approvalRequestSource }
  ) {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.managerApprovalUrl}/managerapproval/items`,
      {
        itemId: payload.itemNbr,
        status: payload.status,
        approvalRequestSource: payload.approvalRequestSource
      },
    );
  }
}
