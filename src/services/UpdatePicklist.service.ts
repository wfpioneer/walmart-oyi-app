import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PickAction } from '../models/Picking.d';

export default class UpdatePicklistService {
  public static updatePickListStatus(payload: {
    headers: { action: PickAction }
    pickListIds: number[];
    palletId: number
  }) {
    const urls: Environment = getEnvironment();
    const { palletId, pickListIds, headers } = payload;
    return Request.patch(
      `${urls.orchestrationURL}/picklist/${palletId}/update`,
      { pickListIds },
      { headers }
    );
  }
}
