import { AxiosRequestHeaders } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

const TIMEOUT = 15000;
export default class AddLocationService {
  public static addLocation(payload: {
    headers?: AxiosRequestHeaders;
    upc: string;
    sectionId: string;
    locationTypeNbr: number;
  }) {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.orchestrationURL}/location/${payload.sectionId}/item/${payload.upc}`,
      {
        sectionId: payload.sectionId,
        locationTypeNbr: payload.locationTypeNbr
      },
      { headers: payload.headers, timeout: TIMEOUT }
    );
  }
}
