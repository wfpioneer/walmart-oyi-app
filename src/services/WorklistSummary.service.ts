import Request from './Request';
import { getEnvironment, Environment } from '../utils/environment';

export default class WorklistSummaryService {
  public static getWorklistSummary() {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.worklistURL}/worklist/summary`,
      method: 'get'
    });
  }
}
