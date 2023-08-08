import Request from './Request';
import { getEnvironment } from '../utils/environment';

export interface SaveLocation {
  name: string;
  qty: number;
}

export default class SaveAuditsProgressService {
  public static saveAuditLocations(payload: { itemNbr: number, locations: SaveLocation[] }) {
    const urls = getEnvironment();
    return Request.put(
      `${urls.orchestrationURL}/worklist/audits/locations`,
      { ...payload }
    );
  }
}
