import {
  mockItem,
  mockLocations,
  mockPickLists,
  mockReserveLocations
} from '../../mockData/mockPickList';
import {
  DELETE_PICKS,
  INITIALIZE_PICKLIST,
  RESET_PICKLIST,
  SELECT_PICKS,
  SET_PICK_CREATE_FLOOR,
  SET_PICK_CREATE_ITEM,
  SET_PICK_CREATE_RESERVE,
  SET_SELECTED_TAB,
  SHOW_PICKING_MENU,
  TOGGLE_MULTI_BIN,
  TOGGLE_MULTI_PICK,
  UPDATE_PICKS,
  deletePicks,
  initializePicklist,
  resetPickList,
  selectPicks,
  setPickCreateFloor,
  setPickCreateItem,
  setPickCreateReserve,
  setSelectedTab,
  showPickingMenu,
  toggleMultiBin,
  toggleMultiPick, updatePicks
} from './Picking';
import { Tabs } from '../../models/Picking.d';

describe('Picking action tests', () => {
  it('tests action creators for picking', () => {
    const initialize = initializePicklist(mockPickLists);
    expect(initialize).toStrictEqual({
      type: INITIALIZE_PICKLIST,
      payload: mockPickLists
    });

    const update = updatePicks(mockPickLists);
    expect(update).toStrictEqual({
      type: UPDATE_PICKS,
      payload: mockPickLists
    });

    const select = selectPicks([1, 2, 3]);
    expect(select).toStrictEqual({
      type: SELECT_PICKS,
      payload: [1, 2, 3]
    });

    const deleteResult = deletePicks([1, 2, 3]);
    expect(deleteResult).toStrictEqual({
      type: DELETE_PICKS,
      payload: [1, 2, 3]
    });

    const resetResult = resetPickList();
    expect(resetResult).toStrictEqual({
      type: RESET_PICKLIST
    });

    const setPickCreateItemResult = setPickCreateItem(mockItem);
    expect(setPickCreateItemResult).toStrictEqual({
      type: SET_PICK_CREATE_ITEM,
      payload: mockItem
    });

    const setPickCreateFloorResult = setPickCreateFloor(mockLocations);
    expect(setPickCreateFloorResult).toStrictEqual({
      type: SET_PICK_CREATE_FLOOR,
      payload: mockLocations
    });

    const setPickCreateReserveResult = setPickCreateReserve(mockReserveLocations);
    expect(setPickCreateReserveResult).toStrictEqual({
      type: SET_PICK_CREATE_RESERVE,
      payload: mockReserveLocations
    });

    const setSelectedTabResult = setSelectedTab(Tabs.QUICKPICK);
    expect(setSelectedTabResult).toStrictEqual({
      type: SET_SELECTED_TAB,
      payload: Tabs.QUICKPICK
    });

    const showPickingMenuResult = showPickingMenu(true);
    expect(showPickingMenuResult).toStrictEqual({
      type: SHOW_PICKING_MENU,
      payload: true
    });

    const toggleMultiBinResult = toggleMultiBin(true);
    expect(toggleMultiBinResult).toStrictEqual({
      type: TOGGLE_MULTI_BIN,
      payload: true
    });

    const toggleMultiPickResult = toggleMultiPick(true);
    expect(toggleMultiPickResult).toStrictEqual({
      type: TOGGLE_MULTI_PICK,
      payload: true
    });
  });
});
