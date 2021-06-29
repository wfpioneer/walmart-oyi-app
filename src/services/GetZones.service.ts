import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class getAllZonesService {
  public static getAllZones(payload: { id: any; headers: any; }) {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.itemDetailsURL}/zone/${payload.id}`,
      undefined,
      { headers: payload.headers }
    );
  }
}
