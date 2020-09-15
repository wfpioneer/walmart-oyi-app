import Request from './Request';

export default class GetItemDetailsService {
  public static editLocation(payload: {headers: object; upc: string, sectionId: string, newSectionId: string,
    locationType: string, prevLocationType: string}) {
    return Request.enqueue({
      url: `https://intl-oyi-location-api.dev.walmart.com/item/${payload.upc}/location/${payload.sectionId}`,
      method: 'put',
      data: {
        sectionId: payload.newSectionId,
        locationType: payload.locationType,
        prevLocationType: payload.prevLocationType
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}