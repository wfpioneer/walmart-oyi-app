import Request from './Request';
import { getEnvironment } from '../utils/environment';

export default class SaveAuditsProgressService {
  public static getAuditLocations(payload: {itemNbr: number, hours?: number }) {
    const urls = getEnvironment();
    const timeLimitParams = payload.hours ? `?timelimit=${payload.hours}` : '';
    return Request.get(
      `${urls.orchestrationURL}/worklist/audits/${payload.itemNbr}${timeLimitParams}`
    );
  }
}
