import { mockPickLists } from '../../mockData/mockPickList';
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
  });
});
