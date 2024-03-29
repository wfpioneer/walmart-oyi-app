import { PickCreateItem, PickListItem, PickStatus } from '../models/Picking.d';
import Location from '../models/Location';

export const mockPickLists: PickListItem[] = [
  {
    assignedAssociate: 'Associate 1',
    category: 71,
    createTs: '2022-04-02T12:55:31.9633333Z',
    createdBy: 'Associate 1',
    id: 418,
    itemDesc: 'Teapot',
    itemNbr: 734,
    moveToFront: true,
    palletId: '4321',
    palletLocationId: 1672,
    palletLocationName: 'C1-2',
    quickPick: false,
    salesFloorLocationId: 1673,
    salesFloorLocationName: 'C1-3',
    status: PickStatus.ACCEPTED_PICK,
    upcNbr: '000041800003'
  },
  {
    assignedAssociate: 'Associate 1',
    category: 71,
    createTs: '2022-02-09T12:55:31.9633333Z',
    createdBy: 'Manager 1',
    id: 3,
    itemDesc: 'Swiffer',
    itemNbr: 845,
    moveToFront: true,
    palletId: '5432',
    palletLocationId: 2345,
    palletLocationName: 'BREW1-2',
    quickPick: false,
    salesFloorLocationId: 2345,
    salesFloorLocationName: 'BREW1-2',
    status: PickStatus.ACCEPTED_PICK,
    upcNbr: '000052900004'
  }
];

export const mockItem: PickCreateItem = {
  itemName: 'treacle tart',
  itemNbr: 2,
  upcNbr: '8675309',
  categoryNbr: 72,
  categoryDesc: 'Deli',
  price: 4.92
};

export const mockLocations: Location[] = [
  {
    aisleId: 2,
    aisleName: '1',
    locationName: 'ABAR1-1',
    sectionId: 3,
    sectionName: '1',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR',
    qty: 10,
    newQty: 0
  },
  {
    aisleId: 2,
    aisleName: '2',
    locationName: 'ABAR2-2',
    sectionId: 4,
    sectionName: '2',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR',
    qty: 10,
    newQty: 0
  }
];

export const mockSomeSaveableLocations: Location[] = [
  {
    aisleId: 2,
    aisleName: '1',
    locationName: 'ABAR1-1',
    sectionId: 3,
    sectionName: '1',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR',
    qty: 10,
    newQty: 0
  },
  {
    aisleId: 2,
    aisleName: '2',
    locationName: 'ABAR2-2',
    sectionId: 4,
    sectionName: '2',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR',
    qty: 10,
    newQty: 10
  }
];

export const mockReserveLocations: Location[] = [
  {
    aisleId: 2,
    aisleName: '2',
    locationName: 'ABAR2-1',
    sectionId: 3,
    sectionName: '1',
    type: 'reserve',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR',
    qty: 10,
    newQty: 0
  },
  {
    aisleId: 3,
    aisleName: '2',
    locationName: 'ABAR2-2',
    sectionId: 4,
    sectionName: '2',
    type: 'reserve',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR',
    qty: 10,
    newQty: 0
  }
];
