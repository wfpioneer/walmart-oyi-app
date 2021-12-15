import { CreateAisles } from '../state/reducers/Location';

export interface CreateAisleRequest {
  zoneId: number;
  aisles: CreateAisles[]
}

export interface ZoneAislesSectionResponse {
  aisleId: number;
  aisleName: number;
  createdSectionsResponseDto: CreateAisleSectionsResponse;
  sectionCount: number;
  status: number;
}

export interface CreateZoneAisleSectionResponse {
  aisles: ZoneAislesSectionResponse[];
  status: number;
  zoneId: number;
  zoneName: string;
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
