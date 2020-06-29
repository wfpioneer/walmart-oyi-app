import Request from './Request';

export default class HitGoogleService {
  public static hitGoogle() {
    return Request.enqueue({
      url: 'https://www.google.com',
      method: 'get',
      timeout: 3000
    });
  }
}
