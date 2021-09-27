import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class LocationService {
  public static getAllZones() : Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/zone`,
      undefined,
    );
  }

  public static getAisle(payload: {zoneId: number}) : Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/zone/${payload.zoneId}/aisle`,
      undefined,
    );
  }

  public static getSections(payload: { aisleId: number}) : Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/aisle/${payload.aisleId}/section`,
      undefined,
    );
  }

  public static getSectionDetails(payload: {sectionName: string, sectionId: number}): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/section/${payload.sectionId || payload.sectionName}/detail`
    );
  }
}
