import { PickStatus } from '../models/Picking.d';

export const mockPickList = [
  {
    assignedAssociate: 'me',
    category: 71,
    createTS: '2022-02-15T05:31:47.000Z',
    createdBy: 'you',
    id: 2,
    itemDesc: 'Lucas gusano',
    itemNbr: 54321,
    moveToFront: true,
    palletId: 3,
    palletLocation: 'ABAR1-1',
    quickPick: true,
    salesFloorLocation: 'ABAR1-2',
    status: PickStatus.ACCEPTED_BIN,
    upcNbr: '725181009016'
  },
  {
    assignedAssociate: 'you',
    category: 34,
    createTS: '2022-02-18T05:31:47.000Z',
    createdBy: 'why',
    id: 5,
    itemDesc: 'Duvalín Bi Sabor',
    itemNbr: 12345,
    moveToFront: true,
    palletId: 4,
    palletLocation: 'ABAR1-2',
    quickPick: false,
    salesFloorLocation: 'ABAR1-1',
    status: PickStatus.ACCEPTED_PICK,
    upcNbr: '02520568'
  },
  {
    assignedAssociate: 'me',
    category: 71,
    createTS: '2022-02-16T05:31:47.000Z',
    createdBy: 'you',
    id: 2,
    itemDesc: 'Lucas gusano',
    itemNbr: 54321,
    moveToFront: true,
    palletId: 3,
    palletLocation: 'ABAR1-2',
    quickPick: true,
    salesFloorLocation: 'ABAR1-2',
    status: PickStatus.ACCEPTED_BIN,
    upcNbr: '725181009016'
  }
];
