import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AsyncState } from '../../models/AsyncState';
import { PalletManagementScreen, onSubmit } from './PalletManagement';

let navigationProp: NavigationProp<any>;
let routeProp: RouteProp<any, string>;
describe('PalletManagementScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };

  const renderer = ShallowRenderer.createRenderer();

  describe('Tests rendering the PalletManagement Screen', () => {
    it('Renders the PalletManagement default ', () => {
      renderer.render(
        <PalletManagementScreen
          useEffectHook={jest.fn()}
          searchText=""
          setSearchText={jest.fn()}
          getPalletDetailsApi={defaultAsyncState}
          navigation={navigationProp}
          dispatch={jest.fn()}
          route={routeProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering Get Pallet Details Api responses', () => {
    it('Renders Loading indicator if get pallet details waiting for an api response', () => {
      const palletDetailsIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      renderer.render(
        <PalletManagementScreen
          useEffectHook={jest.fn()}
          searchText=""
          setSearchText={jest.fn()}
          getPalletDetailsApi={palletDetailsIsWaiting}
          navigation={navigationProp}
          dispatch={jest.fn()}
          route={routeProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests Manual Scan Pallet onSubmit function', () => {
    it('Calls Dispatch Function if a valid numerical Pallet ID is submitted', async () => {
      const dispatch = jest.fn();
      const validPalletID = '12487';
      onSubmit(validPalletID, dispatch);
      expect(dispatch).toHaveBeenCalled();
    });

    it('Does not Call Dispatch function if an in-valid PalletId is submitted', async () => {
      const dispatch = jest.fn();
      const invalidPalletId = '123NotAnId';
      onSubmit(invalidPalletId, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
