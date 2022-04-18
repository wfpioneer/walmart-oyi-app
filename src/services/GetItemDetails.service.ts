import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

const TIMEOUT = 30000; // ms

export interface GetItemDetailsPayload {
  id: number;
  getSummary?: boolean;
  getExcludeHistory?: boolean;
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
}
