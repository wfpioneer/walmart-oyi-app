import Request from './Request';
// @ts-ignore
import KEYS from '../../config/KEYS.json';

export default class WorklistSummaryService {
  public static getWorklistSummary() {
    return Request.enqueue({
      url: 'https://intl-oyi-worklist-api.dev.walmart.com/worklist/summary',
      method: 'get',
      timeout: 10000,
      headers: {
        'Ocp-Apim-Subscription-Key': KEYS['Ocp-Apim-Subscription-Key']
      }
    });
  }
}
