import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { createStore } from 'redux';
import {
  AuditWorklistTabNavigator,
  scannedEventHook,
  scannerListenerHook
} from './AuditWorklistTabNavigator';
import RootReducer from '../../state/reducers/RootReducer';
import { mockInitialState } from '../../mockData/mockStore';
import { resetScannedEvent } from '../../state/actions/Global';
import { mockCombinationAuditsWorklist } from '../../mockData/mockWorkList';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn()
};
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'AuditWorklistTabs'
};
const mockDispatch = jest.fn();

const store = createStore(RootReducer, mockInitialState);

const mockValidateSession = jest
  .fn()
  .mockResolvedValue(true);
jest.useFakeTimers();

describe('AuditWorklistTab Navigator', () => {
  afterEach(() => jest.clearAllMocks());
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
          auditWorklistItems={[]}
          isMounted={{ current: false }}
          scannedEvent={{ type: null, value: null }}
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
          auditWorklistItems={[]}
          isMounted={{ current: false }}
          scannedEvent={{ type: null, value: null }}
        />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('externalized functions', () => {
    const mockUnscannedEvent = { type: null, value: null };
    const mockScannedEvent = { type: 'yes', value: '777555333' };

    it('tests the scanner listener hook', async () => {
      await scannerListenerHook(
        navigationProp,
        mockValidateSession,
        routeProp,
        jest.fn(),
        mockUnscannedEvent,
        mockDispatch
      );

      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });

    const mockMounted: React.MutableRefObject<boolean> = { current: false };
    it('tests the scanned event hook', async () => {
      // initial unmounted call
      scannedEventHook(
        mockMounted,
        navigationProp,
        routeProp,
        mockUnscannedEvent,
        jest.fn(),
        mockDispatch,
        [],
        mockValidateSession
      );

      expect(navigationProp.isFocused).not.toHaveBeenCalled();
      expect(mockMounted.current).toBeTruthy();
      jest.clearAllMocks();

      // second call, but nothing scanned
      scannedEventHook(
        mockMounted,
        navigationProp,
        routeProp,
        mockUnscannedEvent,
        jest.fn(),
        mockDispatch,
        [],
        mockValidateSession
      );
      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockValidateSession).not.toHaveBeenCalled();
      jest.clearAllMocks();

      // called with something scanned
      await scannedEventHook(
        mockMounted,
        navigationProp,
        routeProp,
        mockScannedEvent,
        jest.fn(),
        mockDispatch,
        [],
        mockValidateSession
      );
      expect(mockValidateSession).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({ payload: '777555333' }));
      expect(navigationProp.navigate).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(resetScannedEvent());
      jest.clearAllMocks();
    });

    it('tests the scan event hook with successful scan', async () => {
      const mockTrackEventCall = jest.fn();
      // called with something scanned that is in the worklist
      await scannedEventHook(
        mockMounted,
        navigationProp,
        routeProp,
        mockScannedEvent,
        mockTrackEventCall,
        mockDispatch,
        mockCombinationAuditsWorklist,
        mockValidateSession
      );
      expect(Toast.show).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: '777555333' }));
      expect(navigationProp.navigate).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(resetScannedEvent());
      expect(mockTrackEventCall).toHaveBeenCalled();
    });

    it('tests the scan event hook with an item click from the worklist', async () => {
      mockScannedEvent.type = 'card_click';
      const mockTrackEventCall = jest.fn();
      await scannedEventHook(
        mockMounted,
        navigationProp,
        routeProp,
        mockScannedEvent,
        mockTrackEventCall,
        mockDispatch,
        mockCombinationAuditsWorklist,
        mockValidateSession
      );

      expect(Toast.show).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: '777555333' }));
      expect(navigationProp.navigate).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(resetScannedEvent());
      expect(mockTrackEventCall).not.toHaveBeenCalled();
    });
  });
});
