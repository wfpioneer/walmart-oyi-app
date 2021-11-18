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
}

// eslint-disable-next-line no-shadow
export enum LocationName {
  ZONE = 'Zone',
  AISLE = 'Aisle',
  SECTION = 'Section'
}

export default Location;
