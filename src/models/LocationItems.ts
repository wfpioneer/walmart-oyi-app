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
  items: Omit<SectionDetailsItem, 'price'>[];
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
  floor: SectionDetailsItem[];
  reserve: SectionDetailsPallet[];
}
