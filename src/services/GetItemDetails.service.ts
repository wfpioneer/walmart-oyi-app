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
    const metadataHistoryParam = payload.getMetadataHistory ? `?metadataHistory=${payload.getMetadataHistory}` : '';
    return Request.get(
      `${urls.orchestrationURL}/item/${payload.id}${summaryParam}${excludeHistoryParam}${metadataHistoryParam}`,
      undefined,
      { timeout: TIMEOUT }
    );
  }
}
