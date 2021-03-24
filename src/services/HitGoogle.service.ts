import Request from './Request';

export default class HitGoogleService {
  public static hitGoogle() {
    return Request.get(
      'https://www.google.com',
      undefined,
      { timeout: 3000 }
    );
  }
}
