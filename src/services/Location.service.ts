import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { CreateAisleRequest, CreateAisleResponse } from '../models/CreateZoneAisleSection.d';

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

  public static getSectionDetails(payload: {sectionId: string}): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/v1/section/${payload.sectionId}/detail`
    );
  }

  public static getPalletDetails(payload: {palletIds: number[]}): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    const queryParam = payload.palletIds.join(',');

    return Request.get(
      `${urls.locationUrl}/pallet/items/itemdetails?palletIds=${queryParam}`
    );
  }

  public static createLocationAislesSection(payload: { aislesToCreate: CreateAisleRequest }):
    Promise<AxiosResponse<Array<CreateAisleResponse>>> {
    const urls: Environment = getEnvironment();

    return Request.post(
      `${urls.locationUrl}/aisle/section`,
      payload.aislesToCreate
    );
  }
}
