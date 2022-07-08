import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AsyncState } from '../../models/AsyncState';
import {
  mockMissingPalletWorklistComplete,
  mockMissingPalletWorklistTodo
} from '../../mockData/mockWorkList';
import { CompletedPalletWorklistScreen } from './CompletedPalletWorklist';

let navigationProp: NavigationProp<any>;

describe('CompletedPalletWorklistScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };

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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
