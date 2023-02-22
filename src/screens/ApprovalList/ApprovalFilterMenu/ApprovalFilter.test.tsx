import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react-native';
import store from '../../../state';
import {
  ApprovalFilterScreen,
  RenderSourceCollapsibleCard,
  renderSourceFilterCard
} from './ApprovalFilter';
import { mockApprovals } from '../../../mockData/mockApprovalList';
import { strings } from '../../../locales';
import { trackEvent } from '../../../utils/AppCenterTool';
import { mockSourceMap } from '../../../mockData/mockWorkList';
import { FilteredCategory } from '../../../models/FilterListItem';

jest.mock('../../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('Approval filter render tests', () => {
  const mockDispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ShallowRenders the filter screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ApprovalFilterScreen
          dispatch={mockDispatch}
          approvalList={mockApprovals}
          categoryOpen={false}
          filteredCategories={[]}
          sourceOpen={false}
          filteredSources={[]}
        />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Test renders the filter menu component and calls onPress Function', async () => {
    const { findByText, toJSON } = render(
      <Provider store={store}>
        <ApprovalFilterScreen
          dispatch={mockDispatch}
          categoryOpen={false}
          filteredCategories={[]}
          sourceOpen={false}
          filteredSources={[]}
          approvalList={mockApprovals}
        />
      </Provider>
    );
    // You can query string translations
    const clearButton = findByText(strings('WORKLIST.CLEAR'));
    fireEvent.press(await clearButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('Approval Filter Externalized Function Tests', () => {
  const mockUpdateFilterSources = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tests renderSourceFilterCard and calls onPress event', async () => {
    // Audit Filter Request Source Selected
    const { findByTestId, update } = render(
      renderSourceFilterCard(mockSourceMap[0], [], mockUpdateFilterSources)
    );
    const itemPress = findByTestId('category button');
    fireEvent.press(await itemPress);
    expect(mockUpdateFilterSources).toBeCalledWith([
      mockSourceMap[0].catgName
    ]);

    // Item Details Filter Request Source Selected
    update(
      renderSourceFilterCard(
        mockSourceMap[1],
        [mockSourceMap[0].catgName],
        mockUpdateFilterSources
      )
    );
    fireEvent.press(await itemPress);
    expect(mockUpdateFilterSources).toBeCalledWith([
      mockSourceMap[0].catgName,
      mockSourceMap[1].catgName,
      ''
    ]);

    // TODO Remove when no approval items lack a source
    const noCatg: FilteredCategory = {
      catgName: '',
      selected: false
    };
    const renderSourceNoElement = renderSourceFilterCard(
      noCatg,
      [],
      mockUpdateFilterSources
    );
    expect(renderSourceNoElement).toStrictEqual(<></>);
  });

  it('Tests renderSourceFilterCard and calls onPress event de-selecting source filters', async () => {
    const allSourcesFiltered = [
      mockSourceMap[0].catgName,
      mockSourceMap[1].catgName,
      ''
    ];
    mockSourceMap[0].selected = true;
    mockSourceMap[1].selected = true;

    // Audit Filter Request Source cleared Selection
    const { findByTestId, update } = render(
      renderSourceFilterCard(
        mockSourceMap[0],
        allSourcesFiltered,
        mockUpdateFilterSources
      )
    );
    const itemPress = findByTestId('category button');
    fireEvent.press(await itemPress);
    const removedAuditSource = [mockSourceMap[1].catgName, ''];
    expect(trackEvent).toBeCalledWith('approvals_update_filter_source', {
      categories: JSON.stringify(removedAuditSource)
    });
    expect(mockUpdateFilterSources).toBeCalledWith(removedAuditSource);

    // Item Details Filter Request Source Cleared Selection
    update(
      renderSourceFilterCard(
        mockSourceMap[1],
        removedAuditSource,
        mockUpdateFilterSources
      )
    );
    fireEvent.press(await itemPress);
    expect(trackEvent).toBeCalledWith('approvals_update_filter_source', {
      categories: JSON.stringify([])
    });
    expect(mockUpdateFilterSources).toBeCalledWith([]);
  });

  it('Tests RenderSourceCollapsibleCard and calls toggle source menu onPress event', async () => {
    const mockToggleSrcs = jest.fn();
    const { findByTestId, update } = render(
      <RenderSourceCollapsibleCard
        sourceMap={mockSourceMap}
        sourceOpen={true}
        filterSources={['audits']}
        toggleSrcs={mockToggleSrcs}
        updateFilterSrcs={mockUpdateFilterSources}
      />
    );

    const toggleSrcButton = findByTestId('toggle sources');
    fireEvent.press(await toggleSrcButton);
    expect(mockToggleSrcs).toBeCalledWith(false);

    // Source open set to false
    update(
      <RenderSourceCollapsibleCard
        sourceMap={mockSourceMap}
        sourceOpen={false}
        filterSources={['audits']}
        toggleSrcs={mockToggleSrcs}
        updateFilterSrcs={mockUpdateFilterSources}
      />
    );
    fireEvent.press(await toggleSrcButton);
    expect(mockToggleSrcs).toBeCalledWith(true);
  });
});
