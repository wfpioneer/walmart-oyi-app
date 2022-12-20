import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AsyncState } from 'src/models/AsyncState';
import { AddPalletScreen } from './AddPallet';

let navigationProp: NavigationProp<any>;
describe('AddPalletScreen', () => {
  const renderer = ShallowRenderer.createRenderer();
  const invalidPalletID = '123abc';
  const validPalletID = '123456';
  const locationName = '1A-1';
  const addPalletResult = {
    status: 204,
    data: ''
  };
  const getSectionEmptyResponse: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: addPalletResult
  };
  it('Renders Error for pallet ID containing non number digits', () => {
    renderer.render(
      <AddPalletScreen
        palletId={invalidPalletID}
        updatePalletId={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        section={{ id: 1, name: '1' }}
        addAPI={getSectionEmptyResponse}
        locationName={locationName}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Enabled Submit button for pallet ID containing only numeric digits', () => {
    renderer.render(
      <AddPalletScreen
        palletId={validPalletID}
        updatePalletId={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        section={{ id: 1, name: '1' }}
        locationName={locationName}
        addAPI={getSectionEmptyResponse}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  describe('Rendering Add pallet API responses', () => {
    const apiIsWaiting = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    it('Renders the waiting for response from Add pallet API', () => {
      renderer.render(
        <AddPalletScreen
          palletId={validPalletID}
          updatePalletId={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          addAPI={apiIsWaiting}
          section={{ id: 1, name: '1' }}
          locationName={locationName}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the success response from Add pallet API', () => {
      renderer.render(
        <AddPalletScreen
          palletId={validPalletID}
          updatePalletId={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          addAPI={getSectionEmptyResponse}
          section={{ id: 1, name: '1' }}
          locationName={locationName}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
