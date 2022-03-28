import { PickListItem, PickStatus } from '../models/Picking.d';

export const mockPickLists: PickListItem[] = [
  {
    assignedAssociate: 'Associate 1',
    category: 71,
    createTS: '10:32 AM 02/04/2022',
    createdBy: 'Associate 1',
    id: 418,
    itemDesc: 'Teapot',
    itemNbr: 734,
    moveToFront: true,
    palletId: 4321,
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
    createTS: '4:25 PM 02/09/2022',
    createdBy: 'Manager 1',
    id: 3,
    itemDesc: 'Swiffer',
    itemNbr: 845,
    moveToFront: true,
    palletId: 5432,
    palletLocationId: 2345,
    palletLocationName: 'BREW1-2',
    quickPick: false,
    salesFloorLocationId: 2345,
    salesFloorLocationName: 'BREW1-2',
    status: PickStatus.ACCEPTED_PICK,
    upcNbr: '000052900004'
  }
];
