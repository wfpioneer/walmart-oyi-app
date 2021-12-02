import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

interface Aisle {
  aisleId: number;
  sectionCount: number;
}

interface createSectionRequest {
  aisles: Aisle[];
}

export default class createSectionService {
  public static createSections(payload: createSectionRequest ) {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.locationUrl}/section`,
      payload
    );
  }
}