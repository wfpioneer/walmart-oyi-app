// eslint-disable-next-line no-shadow
export enum PickStatus {
  READY_TO_PICK = 'ready to pick',
  ACCEPTED_PICK = 'accepted pick',
  READY_TO_WORK = 'ready to work',
  READY_TO_BIN = 'ready to bin',
  ACCEPTED_BIN = 'accepted bin',
  COMPLETE = 'complete',
  DELETED = 'deleted',
  NO_PALLETS_FOUND = 'no pallets found'
}

export interface PickListItem {
  id: number;
  itemNbr: number;
  upcNbr: string;
  itemDesc: string;
  category: number;
  quickPick: boolean;
  salesFloorLocationId: number
  salesFloorLocationName: string;
  moveToFront: boolean;
  assignedAssociate: string;
  palletId: number;
  palletLocationId: number
  palletLocationName: string;
  status: PickStatus;
  createdBy: string;
  createTS: string;
}
