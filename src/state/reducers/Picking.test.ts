import { mockPickLists } from '../../mockData/mockPickList';
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
    const initialState: PickingState = {
      pickList: [],
      selectedPicks: []
    };

    const changedState: PickingState = {
      pickList: [],
      selectedPicks: []
    };

    changedState.pickList = mockPickLists;
    let testResults = Picking(initialState, initializePicklist(mockPickLists));
    expect(testResults).toStrictEqual(changedState);

    const toUpdatePick: PickListItem = {
      ...mockPickLists[1],
      status: PickStatus.ACCEPTED_PICK
    };
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
    testResults.pickList = mockPickLists;
    changedState.pickList = [mockPickLists[0]];
    testResults = Picking(testResults, deletePicks(deletePickIds));
    expect(testResults).toStrictEqual(changedState);

    changedState.pickList = [];
    changedState.selectedPicks = [];
    testResults = Picking(testResults, resetPickList());
    expect(testResults).toStrictEqual(changedState);
  });
});
