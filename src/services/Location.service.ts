import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { CreateAisleRequest, CreateAisleResponse } from '../models/CreateZoneAisleSection.d';

interface Aisle {
  aisleId: number;
  sectionCount: number;
}

interface createZoneRequest {
  zoneName: string;
  aisles: [{
    aisleName: number,
    sectionCount: number
  }];
}

export default class LocationService {
  public static getAllZones(): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/zone`,
      undefined,
    );
  }

  public static getAisle(payload: { zoneId: number }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/zone/${payload.zoneId}/aisle`,
      undefined,
    );
  }

  public static getSections(payload: { aisleId: number }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/aisle/${payload.aisleId}/section`,
      undefined,
    );
  }

  public static getSectionDetails(payload: { sectionId: string }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/v1/section/${payload.sectionId}/detail`
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

  public static createSections(payload: Aisle[]): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.locationUrl}/section`,
      payload
    );
  }

  public static createZone(payload: createZoneRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.locationUrl}/zone/aisle/section`,
      payload
    );
  }

  public static deleteZone(payload: number): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.delete(`${urls.locationUrl}/zone/${payload}`);
  }

  public static clearLocation(payload: { locationId: number, target: string }):
    Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.delete(`${urls.locationUrl}/location/${payload.locationId}/${payload.target}`);
  }

  public static removeSection(payload: number): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.delete(`${urls.locationUrl}/section/${payload}`);
  }

  public static getZoneNames(): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(`${urls.locationUrl}/zone/names`);
  }
}
