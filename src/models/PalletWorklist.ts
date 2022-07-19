export type PalletWorklistType = 'MP';

export interface MissingPalletWorklistItemI {
  palletId: number;
  lastKnownPalletLocationId: number;
  lastKnownPalletLocationName: string;
  createUserId: string;
  createTs: string;
  palletDeleted: boolean;
  completed: boolean;
  completedTs?: string;
  completedUserId?: string;
  itemCount?: number;
  sectionID?: number;
}

// eslint-disable-next-line no-shadow
export enum Tabs {
  TODO='ToDo',
  COMPLETED='Completed'
}
