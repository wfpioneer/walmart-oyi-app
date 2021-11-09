import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AddPalletScreen } from './AddPallet';

let navigationProp: NavigationProp<any>;
describe('AddPalletScreen', () => {
  const renderer = ShallowRenderer.createRenderer();
  const invalidPalletID = '123abc';
  const validPalletID = '123456';
  const locationName = '1A-1';

  it('Renders Error for pallet ID containing non number digits', () => {
    renderer.render(
      <AddPalletScreen
        palletId={invalidPalletID}
        updatePalletId={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        section={{ id: 1, name: '1' }}
        locationName={locationName}
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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
