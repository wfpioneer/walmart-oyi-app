import Request from './Request';
import { getEnvironment } from '../utils/environment';

export interface SaveLocation {
  name: string;
  qty: number;
}

export default class SaveAuditsProgressService {
  public static getAuditLocations(payload: {itemNbr: number, hours?: number }) {
    const urls = getEnvironment();
    const timeLimitParams = payload.hours ? `?timelimit=${payload.hours}` : '';
    return Request.get(
      `${urls.orchestrationURL}/worklist/audits/${payload.itemNbr}${timeLimitParams}`
    );
  }

  public static saveAuditLocations(payload: { itemNbr: number, locations: SaveLocation[] }) {
    const urls = getEnvironment();
    return Request.put(
      `${urls.worklistURL}/worklist/audits/locations`,
      { ...payload }
    );
  }
}
