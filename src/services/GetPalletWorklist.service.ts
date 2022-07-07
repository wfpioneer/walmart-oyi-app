import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PalletWorklistType } from '../models/WorklistItem';

export default class GetPalletWorklistService {
  public static getPalletWorklist(payload: {worklistType?: PalletWorklistType[]}) {
    const urls: Environment = getEnvironment();
    let filterUrl = `${urls.worklistURL}/worklist/pallets`;
    if (payload && payload.worklistType) {
      if (payload.worklistType.length > 0) {
        let filters = '';
        payload.worklistType.forEach(val => {
          filters = filters ? `${filters}&worklistType=${val}` : val;
        });
        filterUrl = `${filterUrl}?worklistType=${filters}`;
      }
    }
    return Request.get(filterUrl, undefined);
  }
}
