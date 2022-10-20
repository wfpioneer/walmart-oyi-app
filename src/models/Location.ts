interface Location {
  zoneId: number;
  aisleId: number;
  sectionId: number;
  zoneName: string;
  aisleName: string;
  sectionName: string;
  locationName: string;
  type: string;
  typeNbr: number;
  qty?: number;
  newQty: number;
}

// eslint-disable-next-line no-shadow
export enum LocationName {
  ZONE = 'Zone',
  AISLE = 'Aisle',
  SECTION = 'Section'
}

// eslint-disable-next-line no-shadow
export enum ClearLocationTarget {
  FLOOR = 'items',
  RESERVE = 'pallets',
  FLOORANDRESERVE = 'items-and-pallets'
}

export default Location;
