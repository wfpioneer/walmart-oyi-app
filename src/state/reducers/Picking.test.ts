import {
  mockItem, mockLocations, mockPickLists, mockReserveLocations
} from '../../mockData/mockPickList';
import { PickListItem, PickStatus, Tabs } from '../../models/Picking.d';
import {
  deletePicks,
  initializePicklist,
  resetMultiPickBinSelection,
  resetPickList,
  selectPicks,
  setPickCreateFloor,
  setPickCreateItem,
  setPickCreateReserve,
  setSelectedTab,
  toggleMultiBin,
  toggleMultiPick,
  updateMultiPickSelection,
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
      selectedTab: Tabs.PICK,
      multiBinEnabled: false,
      multiPickEnabled: false
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
      selectedTab: Tabs.PICK,
      multiBinEnabled: false,
      multiPickEnabled: false
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

    changedState.pickCreateReserveLocations = [];
    changedState.multiBinEnabled = true;
    testResults = Picking(initialState, toggleMultiBin(true));
    expect(testResults).toStrictEqual(changedState);

    changedState.multiBinEnabled = false;
    changedState.multiPickEnabled = true;
    testResults = Picking(initialState, toggleMultiPick(true));
    expect(testResults).toStrictEqual(changedState);

    const newInitialState = { ...initialState, pickList: mockPickLists };
    const updatePickList = mockPickLists.map(itm => ({ ...itm, isSelected: true }));
    testResults = Picking(newInitialState, updateMultiPickSelection(mockPickLists, true));
    expect(testResults.pickList).toStrictEqual(updatePickList);

    testResults = Picking(
      newInitialState,
      resetMultiPickBinSelection()
    );
    expect(testResults).toStrictEqual({
      ...newInitialState, pickList: newInitialState.pickList.map(itm => ({ ...itm, isSelected: false }))
    });
  });
});
