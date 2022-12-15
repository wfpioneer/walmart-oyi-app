import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AuditWorklistTabNavigator } from './AuditWorklistTabNavigator';
import store from '../../state';

let navigationProp: NavigationProp<any>;
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'AuditWorklistTabs'
};

describe('AuditWorklistTab Navigator', () => {
  it('Renders the Audit WorkList Tab Navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <AuditWorklistTabNavigator
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          validateSessionCall={jest.fn()}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
        />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
