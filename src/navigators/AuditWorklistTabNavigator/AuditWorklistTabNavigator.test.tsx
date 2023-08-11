import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AuditWorklistTabNavigator, getWorklistAuditApiToUse } from './AuditWorklistTabNavigator';
import store from '../../state';
import { AsyncState } from '../../models/AsyncState';

let navigationProp: NavigationProp<any>;
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'AuditWorklistTabs'
};

describe('AuditWorklistTab Navigator', () => {
  it('Renders the Audit WorkList Tab Navigator component without in progress tab', () => {
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
          enableAuditsInProgress={false}
        />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the Audit worklist tab navigator component with in progress tab', () => {
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
          enableAuditsInProgress={true}
        />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('externalized functions', () => {
    it('tests the get worklist audits api to use function', () => {
      const auditWorklistApi: AsyncState = {
        error: null,
        isWaiting: false,
        result: null,
        value: {
          description: 'Im the v0 endpoint'
        }
      };

      const auditWorklistV1Api: AsyncState = {
        error: null,
        isWaiting: false,
        result: null,
        value: {
          description: 'Im the v1 endpoint'
        }
      };

      const auditsInProgressApi = getWorklistAuditApiToUse(true, auditWorklistApi, auditWorklistV1Api);
      const auditsNoProgressApi = getWorklistAuditApiToUse(false, auditWorklistApi, auditWorklistV1Api);

      expect(auditsInProgressApi).toStrictEqual(auditWorklistV1Api);
      expect(auditsNoProgressApi).toStrictEqual(auditWorklistApi);
    });
  })
});
