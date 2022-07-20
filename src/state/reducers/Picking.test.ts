import { mockItem, mockLocations, mockPickLists, mockReserveLocations } from '../../mockData/mockPickList';
import { PickListItem, PickStatus, Tabs } from '../../models/Picking.d';
import {
  deletePicks,
  initializePicklist,
  resetPickList,
  selectPicks,
  setPickCreateFloor,
  setPickCreateItem,
  setPickCreateReserve,
  setSelectedTab,
  updatePicks
} from '../actions/Picking';
import { Picking, PickingState } from './Picking';

describe('Picking reducer tests', () => {
  it('tests picking reducer', () => {
    const initialState: PickingState = {
      pickList: [],
      selectedPicks: [],
      pickCreateItem: {
        itemName: '',
        itemNbr: 0,
        upcNbr: '',
        categoryNbr: 0,
        categoryDesc: '',
        price: 0
      },
      pickCreateFloorLocations: [],
      pickCreateReserveLocations: [],
      pickingMenu: false,
      selectedTab: Tabs.PICK
    };

    const changedState: PickingState = {
      pickList: [],
      selectedPicks: [],
      pickCreateItem: {
        itemName: '',
        itemNbr: 0,
        upcNbr: '',
        categoryNbr: 0,
        categoryDesc: '',
        price: 0
      },
      pickCreateFloorLocations: [],
      pickCreateReserveLocations: [],
      pickingMenu: false,
      selectedTab: Tabs.PICK
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

    changedState.pickCreateItem = mockItem;
    testResults = Picking(initialState, setPickCreateItem(mockItem));
    expect(testResults).toStrictEqual(changedState);

    changedState.pickCreateItem = initialState.pickCreateItem;
    changedState.selectedTab = Tabs.QUICKPICK;
    testResults = Picking(initialState, setSelectedTab(Tabs.QUICKPICK));
    expect(testResults).toStrictEqual(changedState);

    changedState.selectedTab = Tabs.PICK;
    changedState.pickCreateFloorLocations = mockLocations;
    testResults = Picking(initialState, setPickCreateFloor(mockLocations));
    expect(testResults).toStrictEqual(changedState);

    changedState.pickCreateFloorLocations = [];
    changedState.pickCreateReserveLocations = mockReserveLocations;
    testResults = Picking(initialState, setPickCreateReserve(mockReserveLocations));
    expect(testResults).toStrictEqual(changedState);
  });
});
