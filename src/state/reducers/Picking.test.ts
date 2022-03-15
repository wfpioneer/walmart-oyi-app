import { PickListItem, PickStatus } from '../../models/Picking.d';
import { PickingState } from './Picking';

describe('Picking reducer tests', () => {
  it('tests picking reducer', () => {
    const testPicks: PickListItem[] = [
      {
        assignedAssociate: 'me',
        category: 71,
        createTS: 'yesterday',
        createdBy: 'someone else',
        id: 418,
        itemDesc: 'teapot',
        itemNbr: 734,
        moveToFront: true,
        palletId: 4321,
        palletLocation: 'brewing',
        quickPick: false,
        salesFloorLocation: 'brewing',
        status: PickStatus.ACCEPTED_PICK,
        upcNbr: '000041800003'
      }
    ];

    const initialState: PickingState = {
      pickList: [],
      selectedPicks: []
    };
  });
});
