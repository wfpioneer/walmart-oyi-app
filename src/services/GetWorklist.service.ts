import Request from './Request';
import URLS from '../utils/environment';

export default class GetWorklistService {
  public static getWorklist(payload: {headers: object; worklistType?: [string]}) {
    let filterUrl = `${URLS.worklistURL}/worklist/items`;
    if (payload && payload.worklistType) {
      if (payload.worklistType.length > 0) {
        const filters = payload.worklistType.reduce((acc, current) => {
          return acc + '&type=' + current
        });
        filterUrl = filterUrl + '?type=' + filters;
      }
    }
    console.log(payload);
    return Request.enqueue({
      url: filterUrl,
      method: 'get',
      timeout: 10000
    });
  }
}
