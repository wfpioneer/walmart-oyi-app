import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

const TIMEOUT = 30000; // ms

export default class GetItemDetailsUPCService {
  public static getItemDetailsUPC(payload: { upc: number}) {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/pallet/item/${payload.upc}`
    );
  }
}
