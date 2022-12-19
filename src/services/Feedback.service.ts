import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export interface submitFeedbackRequest {
  countryCd: string;
  body: string; // (comments go here),
  productId: 'a63ee07d-93e6-41ca-807e-050481497dc3'; // (will be different for prod)
  storeNbr: string;
  userId: string;
  subject: string; // OYI App Test Feedback,
  version: string;
  score: number; // (rating from 1-5 goes here)
}
export default class FeedBackService {
  public static submitFeedbackRating(
    payload: submitFeedbackRequest
  ): Promise<AxiosResponse<any>> {
    const urls: Environment = getEnvironment();
    return Request.post(`${urls.atmtUrl}/feedback/api/v2/ratings`, payload);
  }
}
