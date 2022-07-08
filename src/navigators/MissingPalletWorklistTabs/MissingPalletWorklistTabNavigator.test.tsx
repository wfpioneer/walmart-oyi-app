import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import {
  MissingPalletWorklistTabNavigator
} from './MissingPalletWorklistTabNavigator';

let navigationProp: NavigationProp<any>;
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'MissingPalletWorklistTabs'
};

describe('MissingPalletWorklist Navigator', () => {
  it('Renders the Missing Pallet Worklist navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <MissingPalletWorklistTabNavigator
        useFocusEffectHook={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        validateSessionCall={jest.fn()}
        useCallbackHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
