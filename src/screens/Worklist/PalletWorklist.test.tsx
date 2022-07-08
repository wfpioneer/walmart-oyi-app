import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  PalletWorklistScreen,
  clearPalletAPIHook,
  convertDataToDisplayList,
  MPWorklistI
} from './PalletWorklist';
import { mockMissingPalletWorklist, mockMPSecWiseList } from '../../mockData/mockWorkList';
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
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders the PalletWorklist screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletWorklistScreen
        palletWorklist={mockMissingPalletWorklist}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        dispatch={mockDispatch}
        clearPalletAPI={defaultAsyncState}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Test clearPalletApi hook function', () => {
    const mockPalletID = mockMissingPalletWorklist[0].palletId.toString();
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
      mockSetDisplayConfirmation
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
      mockSetDisplayConfirmation
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
      mockSetDisplayConfirmation
    );
    expect(mockDispatch).toBeCalledTimes(1);
  });

  describe('Tests convertDataToDisplayList', () => {
    it('Returns array of MPWorklist items with location header indexes', () => {
      expect(convertDataToDisplayList(mockMissingPalletWorklist, true)).toStrictEqual(mockMPSecWiseList);
    });

    it('Returns array of MPWorklist items with one single all category', () => {
      const allLocList: MPWorklistI[] = [{
        worklistType: 'MP',
        palletId: 0,
        lastKnownLocationId: -1,
        lastKnownLocationName: strings('WORKLIST.ALL'),
        itemCount: mockMissingPalletWorklist.length,
        createId: '',
        createTS: '',
        palletDeleted: false,
        sectionID: 0
      },
      ...mockMissingPalletWorklist.sort((a, b) => a.palletId - b.palletId)];
      expect(convertDataToDisplayList(mockMissingPalletWorklist, false)).toStrictEqual(allLocList);
    });
  });
});
