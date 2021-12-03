export interface ZoneItem {
  zoneId: number;
  zoneName: string;
  aisleCount: number;
}

export interface AisleItem {
  aisleId: number;
  aisleName: string;
  sectionCount: number;
}

export interface SectionItem {
  sectionId: number;
  sectionName: string;
}

export interface SectionDetailsItem {
  itemNbr: number;
  itemDesc: string;
  price: number;
}

export interface SectionDetailsPallet {
  palletId: number;
  palletCreateTS: string;
  items?: Omit<SectionDetailsItem, 'price'>[];
}

export interface ReserveDetailsPallet{
  id: number;
  palletCreateTS?: string;
  items: SectionDetailsItem[];
  statusCode: number;
}

export interface LocationItem {
  zone: {
    id: number;
    name: string;
  };
  aisle: {
    id: number;
    name: string;
  };
  section: {
    id: number;
    name: string;
  };
  items: { sectionItems: SectionDetailsItem[] };
  pallets: {
    palletData: Omit<SectionDetailsPallet, 'items'>[];
  }
}

export interface PossibleZone {
  name: string;
  description: string;
}

// eslint-disable-next-line no-shadow
export enum CREATE_FLOW {
  CREATE_ZONE = 'CREATE_ZONE',
  CREATE_AISLE = 'CREATE_AISLE',
  CREATE_SECTION = 'CREATE_SECTION',
  NOT_STARTED = 'NOT_STARTED'
}
