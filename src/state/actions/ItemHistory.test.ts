import {
  CLEAR_ITEM_HISTORY,
  SET_ITEM_HISTORY,
  clearItemHistory,
  setItemHistory
} from './ItemHistory';
import { ItemHistoryI } from '../../models/ItemDetails';

describe('test action creators for ItemHistory', () => {
  it('test action creators for ItemHistory', () => {
    const data: ItemHistoryI[] = [{
      id: 1,
      date: '2022-07-23',
      qty: 22
    }, {
      id: 2,
      date: '2022-07-19',
      qty: 30
    }];
    const title = 'ITEM.PICK_HISTORY';
    const setPickHistoryResult = setItemHistory(data, title);
    expect(setPickHistoryResult).toStrictEqual({
      type: SET_ITEM_HISTORY,
      payload: { data, title }
    });

    const clearHistoryResult = clearItemHistory();
    expect(clearHistoryResult).toStrictEqual({ type: CLEAR_ITEM_HISTORY });
  });
});
