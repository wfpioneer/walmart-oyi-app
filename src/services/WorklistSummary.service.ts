import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class WorklistSummaryService {
  public static getWorklistSummary() {
    const urls: Environment = getEnvironment();

    return Request.get(
      `${urls.worklistURL}/worklist/v1/summary`,
      undefined
    );
  }

  public static getWorklistSummaryV2() {
    const urls: Environment = getEnvironment();

    return Request.get(
      `${urls.worklistURL}/worklist/v2/summary`,
      undefined
    );
  }
}
