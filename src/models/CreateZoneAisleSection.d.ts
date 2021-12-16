import { CreateAisles } from '../state/reducers/Location';

export interface CreateAisleRequest {
  zoneId: number;
  aisles: CreateAisles[]
}

export interface CreateAisleResponse {
  aisleId: number;
  aisleName: number;
  status: number;
  message: string;
  createdSectionsResponseDto: CreateAisleSectionsResponse;
}

interface CreateAisleSectionsResponse {
  aisleId: number;
  status: number;
  message: string;
  createdSections: string[]
}
