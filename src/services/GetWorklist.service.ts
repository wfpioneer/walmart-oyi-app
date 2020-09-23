import Request from './Request';
import URLS from '../utils/environment';

export default class GetWorklistService {
  // TODO currently the service is hardcoded to only return NSFL when service is corrected and more worklists added will
  // TODO need to add the payload for the type instead of hardcoding it
  public static getWorklist() {
    return Request.enqueue({
      url: `${URLS.worklistURL}/worklist/items?type=NSFL`,
      method: 'get',
      timeout: 10000
    });
  }
}
