import Request from './Request';

export default class AddLocationService {
  public static addLocation(payload: {headers: object; upc: string; sectionId: string; locationTypeNbr: number}) {
    return Request.enqueue({
      url: `https://intl-oyi-location-api.dev.walmart.com/item/${payload.upc}/location/`,
      method: 'post',
      data: {
        sectionId: payload.sectionId,
        locationTypeNbr: payload.locationTypeNbr
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
