import {
  CLEAR_ITEM_HISTORY,
  SET_PICK_HISTORY,
  clearHistory,
  setPickHistory
} from './ItemHistory';
import { PickHistory } from '../../models/ItemDetails';

describe('test action creators for ItemHistory', () => {
  it('test action creators for ItemHistory', () => {
    const data: PickHistory[] = [{
      id: 1,
      itemNbr: 123,
      upcNbr: 12,
      itemDesc: 'test',
      itemQty: 22,
      category: 'test',
      quickPick: false,
      salesFloorLocationName: 'test1-1',
      salesFloorLocationId: 123,
      moveToFront: false,
      assignedAssociate: 'test',
      palletId: 123,
      palletLocationName: 'test-1-1',
      palletLocationId: 123,
      status: 'test',
      createdBy: 'test',
      createTS: '2022-07-23'
    },
    {
      id: 2,
      itemNbr: 123,
      upcNbr: 12,
      itemDesc: 'test',
      itemQty: 30,
      category: 'test',
      quickPick: false,
      salesFloorLocationName: 'test1-1',
      salesFloorLocationId: 123,
      moveToFront: false,
      assignedAssociate: 'test',
      palletId: 123,
      palletLocationName: 'test-1-1',
      palletLocationId: 123,
      status: 'test',
      createdBy: 'test',
      createTS: '2022-07-19'
    }];

    const setPickHistoryResult = setPickHistory(data);
    expect(setPickHistoryResult).toStrictEqual({
      type: SET_PICK_HISTORY,
      payload: data
    });

    const clearHistoryResult = clearHistory();
    expect(clearHistoryResult).toStrictEqual({ type: CLEAR_ITEM_HISTORY });
  });
});
