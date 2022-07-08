import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import { AxiosError } from 'axios';
import { object } from 'prop-types';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PalletWorklist, clearPalletAPIHook } from './PalletWorklist';
import { mockMissingPalletWorklistTodo } from '../../mockData/mockWorkList';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';

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

describe('Tests rendering PalletWorklist screen', () => {
  const mockDispatch = jest.fn();
  const mockOnRefresh = jest.fn();
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };

  const mockError: AxiosError = {
    config: {},
    isAxiosError: true,
    message: '500 Network Error',
    name: 'Network Error',
    toJSON: () => object
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders the PalletWorklist screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletWorklist
        palletWorklist={mockMissingPalletWorklistTodo}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        dispatch={mockDispatch}
        clearPalletAPI={defaultAsyncState}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        onRefresh={jest.fn()}
        refreshing={false}
        error={null}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the PalletWorklist screen when refreshing prop is true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletWorklist
        palletWorklist={mockMissingPalletWorklistTodo}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        dispatch={mockDispatch}
        clearPalletAPI={defaultAsyncState}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        onRefresh={jest.fn()}
        refreshing={true}
        error={null}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the PalletWorklist screen when the backend service encouters an error', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletWorklist
        palletWorklist={mockMissingPalletWorklistTodo}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        dispatch={mockDispatch}
        clearPalletAPI={defaultAsyncState}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        onRefresh={jest.fn()}
        refreshing={false}
        error={mockError}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Test clearPalletApi hook function', () => {
    const mockPalletID = mockMissingPalletWorklistTodo[0].palletId.toString();
    const clearPalletSuccess: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: '',
        status: 204
      }
    };
    const mockSetDisplayConfirmation = jest.fn();
    const successToast = {
      type: 'success',
      text1: strings('PALLET.CLEAR_PALLET_SUCCESS', { palletId: mockPalletID }),
      position: 'bottom'
    };
    clearPalletAPIHook(
      clearPalletSuccess,
      mockPalletID,
      navigationProp,
      mockDispatch,
      mockSetDisplayConfirmation,
      mockOnRefresh
    );

    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockSetDisplayConfirmation).toHaveBeenCalledWith(false);
    expect(navigationProp.isFocused).toBeCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith(successToast);

    jest.clearAllMocks();
    const clearPalletFailure: AsyncState = {
      ...defaultAsyncState,
      error: 'Error communicating with SOAP service'
    };
    // mock navigate go back
    const failedToast = {
      type: 'error',
      text1: strings('PALLET.CLEAR_PALLET_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      position: 'bottom'
    };
    clearPalletAPIHook(
      clearPalletFailure,
      mockPalletID,
      navigationProp,
      mockDispatch,
      mockSetDisplayConfirmation,
      mockOnRefresh
    );

    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockSetDisplayConfirmation).toHaveBeenCalledWith(false);
    expect(Toast.show).toHaveBeenCalledWith(failedToast);

    jest.clearAllMocks();
    const clearPalletIsWaiting: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    clearPalletAPIHook(
      clearPalletIsWaiting,
      mockPalletID,
      navigationProp,
      mockDispatch,
      mockSetDisplayConfirmation,
      mockOnRefresh
    );
    expect(mockDispatch).toBeCalledTimes(1);
  });
});
