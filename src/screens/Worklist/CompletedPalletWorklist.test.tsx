import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AsyncState } from '../../models/AsyncState';
import {
  mockMissingPalletWorklistComplete,
  mockMissingPalletWorklistTodo
} from '../../mockData/mockWorkList';
import { CompletedPalletWorklistScreen } from './CompletedPalletWorklist';
import { Tabs } from '../../models/PalletWorklist';

let navigationProp: NavigationProp<any>;

describe('CompletedPalletWorklistScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };
  const mockTrackEventCall = jest.fn();

  it('Renders an array of complete pallet worklist items with a mixed worklist', () => {
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
      <CompletedPalletWorklistScreen
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
