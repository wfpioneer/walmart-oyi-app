import React from 'react';
import { NavigationContainer, NavigationContext, NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { AsyncState } from '../../models/AsyncState';
import AddItem, { AddItemsScreen, addItemApiHook, scanItemListener } from './AddItems';
import store from '../../state/index';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};
const defaultAsyncState: AsyncState = {
  isWaiting: false,
  result: null,
  error: null,
  value: null
};
const mockDispatch = jest.fn();
const mockNavigateGoBack = jest.fn();
const mockTrackEvent = jest.fn();

const mockSection = {
  id: 1,
  name: 'A1-1'
};

describe('AddItemScreen', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const navContextValue = {
    ...actualNav.navigation,
    isFocused: () => true,
    goBack: jest.fn(),
    addListener: jest.fn(() => jest.fn())
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('render addItem screen', () => {
    it('render screen with navigation and state', () => {
      const component = (
        <Provider store={store}>
          <NavigationContainer>
            <NavigationContext.Provider value={navContextValue}>
              <AddItem />
            </NavigationContext.Provider>
          </NavigationContainer>
        </Provider>
      );
      const { toJSON } = render(component);
      expect(toJSON()).toMatchSnapshot();
    });
    it('Renders addItem screen before service call without manual scan', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AddItemsScreen
          dispatch={mockDispatch}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          section={mockSection}
          addAPI={defaultAsyncState}
          isManualScanEnabled={false}
          addItemsApiStart={0}
          setAddItemsApiStart={jest.fn}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders addItem screen before service call with manual scan', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AddItemsScreen
          dispatch={mockDispatch}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          section={mockSection}
          addAPI={defaultAsyncState}
          isManualScanEnabled={true}
          addItemsApiStart={0}
          setAddItemsApiStart={jest.fn}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders addItem screen when waiting for service call', () => {
      const isWaitingApiCall = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AddItemsScreen
          dispatch={mockDispatch}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          section={mockSection}
          addAPI={isWaitingApiCall}
          isManualScanEnabled={false}
          addItemsApiStart={0}
          setAddItemsApiStart={jest.fn}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('test externalized functions', () => {
    it('test addItemApiHook', () => {
      const successApi = {
        ...defaultAsyncState,
        result: {
          data: 'test'
        }
      };
      const errorApi = {
        ...defaultAsyncState,
        error: 'testError'
      };
      const expectedResetAction = {
        type: 'API/ADD_LOCATION/RESET'
      };
      addItemApiHook(true, successApi, mockDispatch, mockNavigateGoBack, mockTrackEvent, 0);
      expect(mockDispatch).toHaveBeenCalledWith(expectedResetAction);
      expect(mockNavigateGoBack).toHaveBeenCalledTimes(1);
      expect(mockTrackEvent).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledTimes(1);
      jest.clearAllMocks();
      addItemApiHook(true, errorApi, mockDispatch, mockNavigateGoBack, mockTrackEvent, 0);
      expect(mockTrackEvent).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(expectedResetAction);
    });
    it('test scanItemListener', () => {
      const mockScannedEvent = {
        value: '1234567890',
        type: 'UPC_A'
      };
      const expectedAddLocationAction = {
        type: 'SAGA/ADD_LOCATION',
        payload: {
        locationTypeNbr: 8,
        sectionId: '1',
        upc: '1234567890'
        }
      };
      const expectedManualScanAction = {
        type: 'GLOBAL/SET_MANUAL_SCAN',
        payload: false
      };
      const mockSetAddItemsApiStart = jest.fn();
      scanItemListener(mockScannedEvent, mockSection, mockDispatch, mockSetAddItemsApiStart, true);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, expectedAddLocationAction);
      expect(mockDispatch).toHaveBeenNthCalledWith(2, expectedManualScanAction);
      expect(mockSetAddItemsApiStart).toHaveBeenCalled();
    });
  });
});
