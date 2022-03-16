import { PickListItem, PickStatus } from '../../models/Picking.d';
import {
  DELETE_PICKS,
  INITIALIZE_PICKLIST,
  RESET_PICKLIST,
  SELECT_PICKS,
  UPDATE_PICKS,
  deletePicks,
  initializePicklist,
  resetPickList,
  selectPicks,
  updatePicks
} from './Picking';

describe('Picking action tests', () => {
  it('tests action creators for picking', () => {
    const testPicks: PickListItem[] = [
      {
        assignedAssociate: 'me',
        category: 71,
        createTS: 'yesterday',
        createdBy: 'someone else',
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
      }
    ];

    const initialize = initializePicklist(testPicks);
    expect(initialize).toStrictEqual({
      type: INITIALIZE_PICKLIST,
      payload: testPicks
    });

    const update = updatePicks(testPicks);
    expect(update).toStrictEqual({
      type: UPDATE_PICKS,
      payload: testPicks
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
  });
});
