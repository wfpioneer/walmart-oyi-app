import {
  CLEAR_SELECTED_PALLET_WORKLIST_ID,
  SET_SELECTED_TAB,
  SET_SELECTED_WORKLIST_PALLET_ID,
  clearSelectedWorklistPalletId,
  setSelectedTab,
  setSelectedWorklistPalletId
} from './PalletWorklist';
import { Tabs } from '../../models/PalletWorklist';

describe('test action creators for PalletWorklist', () => {
  it('handles selected tab action while toggling between the tabs', () => {
    let setSelectedTabResult = setSelectedTab(Tabs.COMPLETED);
    expect(setSelectedTabResult).toStrictEqual({
      type: SET_SELECTED_TAB,
      payload: Tabs.COMPLETED
    });
    setSelectedTabResult = setSelectedTab(Tabs.TODO);
    expect(setSelectedTabResult).toStrictEqual({
      type: SET_SELECTED_TAB,
      payload: Tabs.TODO
    });
  });
  it('handles setting the selected worklist pallet Id', () => {
    const testPalletId = '4988';
    const setSelectedWorklistPalletIdResult = setSelectedWorklistPalletId(testPalletId);
    expect(setSelectedWorklistPalletIdResult).toStrictEqual({
      type: SET_SELECTED_WORKLIST_PALLET_ID,
      payload: testPalletId
    });
  });
  it('handles clearing the selected pallet Id after it got assigned to a Location', () => {
    const clearSelectedWorklistPalletIdResult = clearSelectedWorklistPalletId();
    expect(clearSelectedWorklistPalletIdResult).toStrictEqual({
      type: CLEAR_SELECTED_PALLET_WORKLIST_ID
    });
  });
});
