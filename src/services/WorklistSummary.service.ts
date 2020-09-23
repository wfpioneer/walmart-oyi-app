import Request from './Request';
import URLS from '../utils/environment';

export default class WorklistSummaryService {
  public static getWorklistSummary() {
    return Request.enqueue({
      url: `${URLS.worklistURL}/worklist/summary`,
      method: 'get',
      timeout: 10000
    });
  }
}
