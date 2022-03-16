import { PickListItem, PickStatus } from '../../models/Picking.d';
import {
  deletePicks,
  initializePicklist,
  resetPickList,
  selectPicks,
  updatePicks
} from '../actions/Picking';
import { Picking, PickingState } from './Picking';

describe('Picking reducer tests', () => {
  it('tests picking reducer', () => {
    const testPicks: PickListItem[] = [
      {
        assignedAssociate: 'who',
        category: 71,
        createTS: 'yesterday',
        createdBy: 'what',
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
      },
      {
        assignedAssociate: 'I dont know',
        category: 35,
        createTS: 'today',
        createdBy: 'why',
        id: 3,
        itemDesc: 'third base',
        itemNbr: 34,
        moveToFront: false,
        palletId: 720,
        palletLocation: 'left field',
        quickPick: true,
        salesFloorLocation: 'field',
        status: PickStatus.READY_TO_PICK,
        upcNbr: '930542945500'
      }
    ];

    const initialState: PickingState = {
      pickList: [],
      selectedPicks: []
    };

    const changedState: PickingState = {
      pickList: [],
      selectedPicks: []
    };

    changedState.pickList = testPicks;
    let testResults = Picking(initialState, initializePicklist(testPicks));
    expect(testResults).toStrictEqual(changedState);

    const toUpdatePick: PickListItem = { ...testPicks[1], status: PickStatus.ACCEPTED_PICK };
    changedState.pickList.pop();
    changedState.pickList.push(toUpdatePick);
    testResults = Picking(testResults, updatePicks([toUpdatePick]));
    expect(testResults).toStrictEqual(changedState);

    const pickIds = [1, 2, 3];
    changedState.pickList = [];
    changedState.selectedPicks = pickIds;
    testResults = Picking(initialState, selectPicks(pickIds));
    expect(testResults).toStrictEqual(changedState);

    const deletePickIds = [3];
    testResults.pickList = testPicks;
    changedState.pickList = [testPicks[0]];
    testResults = Picking(testResults, deletePicks(deletePickIds));
    expect(testResults).toStrictEqual(changedState);

    changedState.pickList = [];
    changedState.selectedPicks = [];
    testResults = Picking(testResults, resetPickList());
    expect(testResults).toStrictEqual(changedState);
  });
});
