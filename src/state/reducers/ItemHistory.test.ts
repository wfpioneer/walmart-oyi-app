import {
  ItemHistory, ItemHistoryState, initialState
} from './ItemHistory';
import { ItemHistoryI } from '../../models/ItemDetails';
import {
  clearHistory,
  setHistory
} from '../actions/ItemHistory';

describe('testing ItemHistory reducer', () => {
  it('testing ItemHistory reducer', () => {
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
    const resultState: ItemHistoryState = { data, title };
    expect(ItemHistory(initialState, setHistory(data, title))).toStrictEqual(resultState);
    expect(ItemHistory(initialState, clearHistory())).toStrictEqual(initialState);
  });
});
