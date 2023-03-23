import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

const TIMEOUT = 30000; // ms

export interface GetItemDetailsPayload {
  id: number;
  getSummary?: boolean;
  getExcludeHistory?: boolean;
  getMetadataHistory?: boolean;
}

export default class GetItemDetailsService {
  public static getItemDetails(payload: GetItemDetailsPayload): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    const summaryParam = payload.getSummary ? `?summaryDetails=${payload.getSummary}` : '';
    const excludeHistoryParam = payload.getExcludeHistory ? `?excludeHistory'=${payload.getExcludeHistory}` : '';
    return Request.get(
      `${urls.itemDetailsURL}/v2/item/${payload.id}${summaryParam}${excludeHistoryParam}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }

  public static getItemDetailsV4(payload: GetItemDetailsPayload): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    const summaryParam = payload.getSummary ? `?summaryDetails=${payload.getSummary}` : '';
    return Request.get(
      `${urls.itemDetailsURL}/v4/item/${payload.id}${summaryParam}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }

  public static getItemPiHistory(itemNbr: number): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.itemDetailsURL}/item/pihistory/${itemNbr}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }

  public static getItemPiSalesHistory(itemNbr: number): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.itemDetailsURL}/item/pisaleshistory/${itemNbr}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }

  public static getItemPicklistHistory(itemNbr: number): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.orchestrationURL}/picklist?itemNbr=${itemNbr}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }

  public static getLocationsForItem(itemNbr: number): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.orchestrationURL}/location/item/${itemNbr}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }

  public static getItemManagerApprovalHistory(itemNbr: number): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.orchestrationURL}/managerapproval/item/${itemNbr}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }
}
