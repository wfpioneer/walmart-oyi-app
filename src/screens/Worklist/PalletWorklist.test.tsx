import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import { AxiosError } from 'axios';
import { object } from 'prop-types';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  PalletWorklist,
  clearPalletAPIHook,
  convertDataToDisplayList
} from './PalletWorklist';
import {
  mockMPSecWiseList,
  mockMissingPalletWorklist,
  mockMissingPalletWorklistTodo
} from '../../mockData/mockWorkList';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';
import { MissingPalletWorklistItemI, Tabs } from '../../models/PalletWorklist';

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
        groupToggle={false}
        updateGroupToggle={jest.fn()}
        selectedTab={Tabs.TODO}
        setPalletClicked={jest.fn()}
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
        groupToggle={false}
        updateGroupToggle={jest.fn()}
        selectedTab={Tabs.TODO}
        setPalletClicked={jest.fn()}
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
        groupToggle={false}
        updateGroupToggle={jest.fn()}
        selectedTab={Tabs.TODO}
        setPalletClicked={jest.fn()}
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

  describe('Tests convertDataToDisplayList', () => {
    it('Returns array of MPWorklist items with location header indexes', () => {
      expect(convertDataToDisplayList(mockMissingPalletWorklist, true)).toStrictEqual(mockMPSecWiseList);
    });

    it('Returns array of MPWorklist items with one single all category', () => {
      const allLocList: MissingPalletWorklistItemI[] = [{
        palletId: 0,
        lastKnownPalletLocationId: -1,
        lastKnownPalletLocationName: strings('WORKLIST.ALL'),
        itemCount: mockMissingPalletWorklist.length,
        createUserId: '',
        createTs: '',
        palletDeleted: false,
        sectionID: 0,
        completed: false
      },
      ...mockMissingPalletWorklist.sort((a, b) => a.palletId - b.palletId)];
      expect(convertDataToDisplayList(mockMissingPalletWorklist, false)).toStrictEqual(allLocList);
    });
  });
});
