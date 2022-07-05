import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class GetPalletWorklistService {
  public static getPalletWorklist(payload: {worklistType?: [string]}) {
    const urls: Environment = getEnvironment();
    let filterUrl = `${urls.worklistURL}/worklist/pallets`;
    if (payload && payload.worklistType) {
      if (payload.worklistType.length > 0) {
        const filters = payload.worklistType.reduce((acc, current) => `${acc}&type=${current}`);
        filterUrl = `${filterUrl}?type=${filters}`;
      }
    }
    return Request.get(filterUrl, undefined);
  }
}
