import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class GetWorklistService {
  public static getWorklist(payload: {worklistType?: string[]}) {
    const urls: Environment = getEnvironment();
    let filterUrl = `${urls.worklistURL}/worklist/items`;
    if (payload && payload.worklistType) {
      if (payload.worklistType.length > 0) {
        const filters = payload.worklistType.reduce((acc, current) => `${acc}&type=${current}`);
        filterUrl = `${filterUrl}?type=${filters}`;
      }
    }
    return Request.get(filterUrl, undefined);
  }

  public static getWorklistV1(payload: {worklistType?: string[]}) {
    const urls: Environment = getEnvironment();
    let filterUrl = `${urls.worklistURL}/worklist/v1/items`;
    if (payload && payload.worklistType) {
      if (payload.worklistType.length > 0) {
        const filters = payload.worklistType.reduce((acc, current) => `${acc}&type=${current}`);
        filterUrl = `${filterUrl}?type=${filters}`;
      }
    }
    return Request.get(filterUrl, undefined);
  }

  public static getWorklistAuditV1(payload: {worklistType?: string[]}) {
    const urls: Environment = getEnvironment();
    let filterUrl = `${urls.worklistURL}/worklist/v1/audits`;
    if (payload && payload.worklistType) {
      if (payload.worklistType.length > 0) {
        const filters = payload.worklistType.reduce((acc, current) => `${acc}&type=${current}`);
        filterUrl = `${filterUrl}?type=${filters}`;
      }
    }
    return Request.get(filterUrl, undefined);
  }
}
