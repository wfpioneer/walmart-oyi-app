import { AxiosResponse } from 'axios';
import Config from 'react-native-config';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export interface submitFeedbackRequest {
  countryCd: string;
  body: string;
  storeNbr: number;
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
    // TODO add productId for Production
    const productId = Config.ENVIRONMENT === 'prod'
      ? 'd4687cc7-7846-4550-95fd-70299b956bc3'
      : 'a63ee07d-93e6-41ca-807e-050481497dc3';
    return Request.post(
      `${urls.atmtUrl}/feedback/api/v2/ratings`,
      {
        ...payload,
        productId
      }
    );
  }
}
