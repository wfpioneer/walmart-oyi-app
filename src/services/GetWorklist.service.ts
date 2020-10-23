import Request from './Request';
import { getEnvironment, Environment } from '../utils/environment';

export default class GetWorklistService {
  public static getWorklist(payload: {headers: object; worklistType?: [string]}) {
    const urls: Environment = getEnvironment();
    let filterUrl = `${urls.worklistURL}/worklist/items`;
    if (payload && payload.worklistType) {
      if (payload.worklistType.length > 0) {
        const filters = payload.worklistType.reduce((acc, current) => `${acc}&type=${current}`);
        filterUrl = `${filterUrl}?type=${filters}`;
      }
    }
    return Request.enqueue({
      url: filterUrl,
      method: 'get',
    });
  }
}
