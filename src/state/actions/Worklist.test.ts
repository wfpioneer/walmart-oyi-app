import {
  CLEAR_FILTER,
  TOGGLE_CATEGORIES,
  TOGGLE_EXCEPTIONS,
  TOGGLE_MENU,
  UPDATE_FILTER_CATEGORIES,
  UPDATE_FILTER_EXCEPTIONS,
  clearFilter,
  toggleCategories,
  toggleExceptions,
  toggleMenu,
  updateFilterCategories,
  updateFilterExceptions
} from './Worklist';

describe('test action creators for Worklist', () => {
  it('test action creators for Worklist', () => {
    // toggleMenu action
    const mockMenuOpen = true;
    const toggleMenuResult = toggleMenu(mockMenuOpen);
    expect(toggleMenuResult).toStrictEqual({
      type: TOGGLE_MENU,
      payload: mockMenuOpen
    });
    // toggleCategories action
    const mockCategoriesOpen = true;
    const toggleCategoriesResult = toggleCategories(mockCategoriesOpen);
    expect(toggleCategoriesResult).toStrictEqual({
      type: TOGGLE_CATEGORIES,
      payload: mockCategoriesOpen
    });
    // toggleExceptions action
    const mockExceptionOpen = true;
    const toggleExceptionsResult = toggleExceptions(true);
    expect(toggleExceptionsResult).toStrictEqual({
      type: TOGGLE_EXCEPTIONS,
      payload: mockExceptionOpen
    });
    // updateFilterCategories action
    const testCategoriesList = ['3 - OFFICE SUPPLIES', '31 - OFFICE ELECTRONICS'];
    const updateFilterCategoriesResult = updateFilterCategories(testCategoriesList);
    expect(updateFilterCategoriesResult).toStrictEqual({
      type: UPDATE_FILTER_CATEGORIES,
      payload: testCategoriesList
    });
    // updateFilterExceptions action
    const testExceptionsList = ['PO'];
    const updateFilterExceptionsResult = updateFilterExceptions(testExceptionsList);
    expect(updateFilterExceptionsResult).toStrictEqual({
      type: UPDATE_FILTER_EXCEPTIONS,
      payload: testExceptionsList
    });
    // clearFilter action
    const clearFilterResult = clearFilter();
    expect(clearFilterResult).toStrictEqual({
      type: CLEAR_FILTER
    });
  });
});
