import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { TodoPalletWorklistScreen } from './TodoPalletWorklist';
import { AsyncState } from '../../models/AsyncState';
import {
  mockMissingPalletWorklistComplete,
  mockMissingPalletWorklistTodo
} from '../../mockData/mockWorkList';
import { Tabs } from '../../models/PalletWorklist';

let navigationProp: NavigationProp<any>;

describe('TodoPalletWorklistScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };
  const mockTrackEventCall = jest.fn();

  it('Renders an array of incomplete pallet worklist items with incomplete and complete items', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getPalletWorklistSuccess: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: [
          ...mockMissingPalletWorklistTodo,
          ...mockMissingPalletWorklistComplete
        ]
      }
    };
    renderer.render(
      <TodoPalletWorklistScreen
        dispatch={jest.fn()}
        clearPalletAPI={defaultAsyncState}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        getMPWorklistApi={getPalletWorklistSuccess}
        navigation={navigationProp}
        groupToggle={false}
        updateGroupToggle={jest.fn()}
        selectedTab={Tabs.COMPLETED}
        setPalletClicked={jest.fn()}
        trackEventCall={mockTrackEventCall}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
