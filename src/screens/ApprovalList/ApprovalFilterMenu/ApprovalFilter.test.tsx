import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react-native';
import store from '../../../state';
import { ApprovalFilterScreen } from './ApprovalFilter';
import { mockApprovals } from '../../../mockData/mockApprovalList';
import { strings } from '../../../locales';
import { trackEvent } from '../../../utils/AppCenterTool';

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
