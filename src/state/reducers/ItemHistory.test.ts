import { ItemHistory, ItemHistoryState, initialState } from './ItemHistory';
import {
  clearHistory,
  setPickHistory
} from '../actions/ItemHistory';
import { IPickHistory } from '../../models/ItemDetails';

describe('testing ItemHistory reducer', () => {
  it('testing ItemHistory reducer', () => {
    const data: IPickHistory[] = [{
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

    const resultState: ItemHistoryState = {
      data: [{
        id: 1,
        date: '2022-07-23',
        qty: 22
      }, {
        id: 2,
        date: '2022-07-19',
        qty: 30
      }],
      title: 'ITEM.PICK_HISTORY'
    };
    expect(ItemHistory(initialState, setPickHistory(data))).toStrictEqual(resultState);
    expect(ItemHistory(initialState, clearHistory())).toStrictEqual(initialState);
  });
});
