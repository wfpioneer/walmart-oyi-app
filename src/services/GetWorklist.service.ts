import Request from './Request';
// @ts-ignore
import KEYS from '../../config/KEYS.json';

export default class GetWorklistService {
  public static getWorklist() {
    return Request.enqueue({
      url: 'https://intl-dev-ops-common-apim.azure-api.net/oyi/worklist/items',
      method: 'get',
      timeout: 10000,
      headers: {
        'Ocp-Apim-Subscription-Key': KEYS['Ocp-Apim-Subscription-Key']
      }
    });
  }
}
