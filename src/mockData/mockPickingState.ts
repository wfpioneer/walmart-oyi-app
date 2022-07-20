import { PickingState } from '../state/reducers/Picking';
import {
  PickCreateItem, PickListItem, PickStatus, Tabs
} from '../models/Picking.d';

const basePickItem: PickListItem = {
  assignedAssociate: '',
  category: 3,
  createTs: '2022-04-03T12:55:31.9633333Z',
  createdBy: 'Guude',
  id: 0,
  itemDesc: 'generic description',
  itemNbr: 1,
  moveToFront: false,
  palletId: '43',
  palletLocationId: 4,
  palletLocationName: 'ABAR1-2',
  quickPick: false,
  salesFloorLocationId: 5,
  salesFloorLocationName: 'ABAR1-3',
  status: PickStatus.DELETED,
  upcNbr: '1234567890123'
};

const mockItem: PickCreateItem = {
  itemName: 'treacle tart',
  itemNbr: 2,
  upcNbr: '8675309',
  categoryNbr: 72,
  categoryDesc: 'Deli',
  price: 4.92
};

const otherPickStateValues = {
  selectedPicks: [0],
  pickCreateItem: mockItem,
  pickCreateFloorLocations: [],
  pickCreateReserveLocations: [],
  selectedTab: Tabs.QUICKPICK,
  pickingMenu: false
};

export const mockPickingState: PickingState = {
  pickList: [
    {
      ...basePickItem,
      assignedAssociate: 'vn51wu8',
      status: PickStatus.READY_TO_PICK
    },
    {
      ...basePickItem,
      assignedAssociate: 't0s0og',
      status: PickStatus.ACCEPTED_PICK,
      id: 1,
      palletId: '40'
    }
  ],
  ...otherPickStateValues
};
