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
  upcNbr: string;
  locationType: number;
}

export interface SectionDetailsPallet {
  palletId: string;
  palletCreateTS: string;
  items?: Omit<SectionDetailsItem, 'price'>[];
}

export interface ReserveDetailsPallet{
  id: number;
  createDate: string;
  expirationDate: string;
  items: SectionDetailsItem[];
  statusCode: number;
  palletCreateTS: string;
  palletId: string;
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
  zoneName: string;
  description: string;
}

// eslint-disable-next-line no-shadow
export enum CREATE_FLOW {
  CREATE_ZONE = 'CREATE_ZONE',
  CREATE_AISLE = 'CREATE_AISLE',
  CREATE_SECTION = 'CREATE_SECTION',
  NOT_STARTED = 'NOT_STARTED'
}
