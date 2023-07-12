import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  EventListenerCallback,
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { BackHandlerStatic, NativeEventEmitter } from 'react-native';
import {
  ManagePalletScreen,
  backHandlerEventHook,
  barcodeEmitterHook,
  clearPalletApiHook,
  deleteItemDetail,
  enableSave,
  getItemDetailsApiHook,
  getNumberOfDeleted,
  getPalletDetailsApiHook,
  handleAddItems,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleTextChange,
  handleUpdateItems,
  isAddedItemPerishable,
  isExpiryDateChanged,
  isPerishableItemDeleted,
  isQuantityChanged,
  itemCard,
  navListenerHook,
  onEndEditing,
  onValidateHardwareBackPress,
  postCreatePalletApiHook,
  removeExpirationDate,
  renderWarningModal,
  undoDelete,
  updatePalletApisHook
} from './ManagePallet';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import { AsyncState } from '../../models/AsyncState';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import {
  deleteItem,
  removeItem,
  resetItems,
  setPalletItemNewQuantity,
  updatePalletExpirationDate
} from '../../state/actions/PalletManagement';
import { strings } from '../../locales';
import getItemDetails from '../../mockData/getItemDetails';
import { mockConfig } from '../../mockData/mockConfig';
import { validateSession } from '../../utils/sessionTimeout';
import store from '../../state';
import { GET_ITEM_DETAILS_V4 } from '../../state/actions/asyncAPI';
import { BeforeRemoveEvent } from '../../models/Generics.d';

const TRY_AGAIN_TEXT = 'GENERICS.TRY_AGAIN';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

jest.mock('../../state/actions/PalletManagement', () => ({
  ...jest.requireActual('../../state/actions/PalletManagement'),
  updatePalletExpirationDate: jest.fn()
}));

jest.mock('../../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn(() => Promise.resolve())
}));

describe('ManagePalletScreen', () => {
  const mockPalletInfo: PalletInfo = {
    id: '1514',
    expirationDate: '01/31/2022'
  };
  const mockNewExpirationDate = '03/04/2022';
  const mockItems: PalletItem[] = [
    {
      itemNbr: 1234,
      upcNbr: '1234567890',
      itemDesc: 'test',
      quantity: 3,
      newQuantity: 3,
      price: 10.0,
      categoryNbr: 54,
      categoryDesc: 'test cat',
      deleted: true,
      added: false,
      locationName: 'ARAR1-1'
    },
    {
      itemNbr: 1234,
      upcNbr: '12345678901',
      itemDesc: 'test',
      quantity: 3,
      newQuantity: 4,
      price: 10.0,
      categoryNbr: 54,
      categoryDesc: 'test cat',
      deleted: false,
      added: false,
      locationName: 'ARAR1-1'
    },
    {
      itemNbr: 4221,
      upcNbr: '765432123456',
      itemDesc: 'food',
      quantity: 2,
      newQuantity: 1,
      price: 3.49,
      categoryNbr: 72,
      categoryDesc: 'deli',
      deleted: false,
      added: false,
      locationName: 'ARAR1-1'
    }
  ];

  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
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
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn()
  };

  const barCodeEmitterProp: NativeEventEmitter = {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
    removeSubscription: jest.fn(),
    listenerCount: jest.fn(),
    emit: jest.fn(),
    removeListener: jest.fn()
  };

  const mockCountryCode = 'MX';
  const routeProp: RouteProp<any, string> = {
    key: 'Test',
    name: ''
  };
  describe('Tests rendering the PalletManagement Screen', () => {
    describe('Tests rendering Api responses', () => {
      it('Renders screen with newly added if get items details response sent sucesss', () => {
        const renderer = ShallowRenderer.createRenderer();
        const successAsyncState: AsyncState = {
          isWaiting: false,
          value: null,
          error: null,
          result: {
            upcNbr: '123',
            itemNbr: '323',
            price: 12,
            itemDesc: 'ItemDesc'
          }
        };
        renderer.render(
          <ManagePalletScreen
            useEffectHook={jest.fn}
            isManualScanEnabled={true}
            palletInfo={mockPalletInfo}
            items={mockItems}
            navigation={navigationProp}
            route={routeProp}
            dispatch={jest.fn()}
            getItemDetailsApi={successAsyncState}
            addPalletUpcApi={defaultAsyncState}
            updateItemQtyAPI={defaultAsyncState}
            deleteUpcsApi={defaultAsyncState}
            getPalletDetailsApi={defaultAsyncState}
            clearPalletApi={defaultAsyncState}
            displayClearConfirmation={false}
            setDisplayClearConfirmation={jest.fn()}
            isPickerShow={false}
            setIsPickerShow={jest.fn()}
            perishableCategories={[]}
            displayWarningModal={false}
            setDisplayWarningModal={jest.fn()}
            useFocusEffectHook={jest.fn()}
            useCallbackHook={jest.fn()}
            confirmBackNavigate={false}
            setConfirmBackNavigate={jest.fn()}
            createPallet={false}
            postCreatePalletApi={defaultAsyncState}
            userConfigs={mockConfig}
            countryCode={mockCountryCode}
            trackEventCall={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

      it('Tests Save Button onSubmit function ', () => {
        const mockDispatch = jest.fn();
        const mockTrackEventCall = jest.fn();
        const successAsyncState: AsyncState = {
          isWaiting: false,
          value: null,
          error: null,
          result: {
            upcNbr: '123',
            itemNbr: '323',
            price: 12,
            itemDesc: 'ItemDesc'
          }
        };
        const { getByTestId, update } = render(
          <Provider store={store}>
            <ManagePalletScreen
              useEffectHook={jest.fn}
              isManualScanEnabled={true}
              palletInfo={mockPalletInfo}
              items={mockItems}
              navigation={navigationProp}
              route={routeProp}
              dispatch={mockDispatch}
              getItemDetailsApi={successAsyncState}
              addPalletUpcApi={defaultAsyncState}
              updateItemQtyAPI={defaultAsyncState}
              deleteUpcsApi={defaultAsyncState}
              getPalletDetailsApi={defaultAsyncState}
              clearPalletApi={defaultAsyncState}
              displayClearConfirmation={false}
              setDisplayClearConfirmation={jest.fn()}
              isPickerShow={false}
              setIsPickerShow={jest.fn()}
              perishableCategories={[]}
              displayWarningModal={false}
              setDisplayWarningModal={jest.fn()}
              useFocusEffectHook={jest.fn()}
              useCallbackHook={jest.fn()}
              confirmBackNavigate={false}
              setConfirmBackNavigate={jest.fn()}
              createPallet={false}
              postCreatePalletApi={defaultAsyncState}
              userConfigs={mockConfig}
              countryCode={mockCountryCode}
              trackEventCall={mockTrackEventCall}
            />
          </Provider>
        );
        const onSubmitButton = getByTestId('Enable Save Button');

        fireEvent.press(onSubmitButton);

        expect(mockDispatch).toHaveBeenCalled();

        update(
          <Provider store={store}>
            <ManagePalletScreen
              useEffectHook={jest.fn}
              isManualScanEnabled={true}
              palletInfo={mockPalletInfo}
              items={mockItems}
              navigation={navigationProp}
              route={routeProp}
              dispatch={mockDispatch}
              getItemDetailsApi={successAsyncState}
              addPalletUpcApi={defaultAsyncState}
              updateItemQtyAPI={defaultAsyncState}
              deleteUpcsApi={defaultAsyncState}
              getPalletDetailsApi={defaultAsyncState}
              clearPalletApi={defaultAsyncState}
              displayClearConfirmation={false}
              setDisplayClearConfirmation={jest.fn()}
              isPickerShow={false}
              setIsPickerShow={jest.fn()}
              perishableCategories={[]}
              displayWarningModal={false}
              setDisplayWarningModal={jest.fn()}
              useFocusEffectHook={jest.fn()}
              useCallbackHook={jest.fn()}
              confirmBackNavigate={false}
              setConfirmBackNavigate={jest.fn()}
              createPallet={true}
              postCreatePalletApi={defaultAsyncState}
              userConfigs={mockConfig}
              countryCode={mockCountryCode}
              trackEventCall={mockTrackEventCall}
            />
          </Provider>
        );
        fireEvent.press(onSubmitButton);
        expect(mockTrackEventCall).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalled();
      });

      it('Tests Confirm/Cancel Back Button onSubmit function in renderWarningModal', () => {
        const mockDispatch = jest.fn();
        const mockSetConfirmBackNavigate = jest.fn();
        const mockSetDisplayWarning = jest.fn();
        const { getByTestId } = render(
          <Provider store={store}>
            {renderWarningModal(
              true,
              mockSetDisplayWarning,
              mockSetConfirmBackNavigate,
              mockDispatch
            )}
          </Provider>
        );
        const onCancelButton = getByTestId('Cancel Back Button');
        const onConfirmButton = getByTestId('Confirm Back Button');

        fireEvent.press(onCancelButton);
        expect(mockSetDisplayWarning).toHaveBeenCalledWith(false);
        expect(mockSetConfirmBackNavigate).toHaveBeenCalledWith(false);

        fireEvent.press(onConfirmButton);
        expect(mockSetDisplayWarning).toHaveBeenCalledWith(false);
        expect(mockSetConfirmBackNavigate).toHaveBeenCalledWith(true);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: GET_ITEM_DETAILS_V4.RESET
        });
      });
    });

    describe('Tests rendering the ManagePalletScreen', () => {
      it('Renders the PalletManagement default ', () => {
        const renderer = ShallowRenderer.createRenderer();

        renderer.render(
          <ManagePalletScreen
            useEffectHook={jest.fn}
            isManualScanEnabled={true}
            palletInfo={mockPalletInfo}
            items={mockItems}
            navigation={navigationProp}
            route={routeProp}
            dispatch={jest.fn()}
            getItemDetailsApi={defaultAsyncState}
            addPalletUpcApi={defaultAsyncState}
            updateItemQtyAPI={defaultAsyncState}
            deleteUpcsApi={defaultAsyncState}
            getPalletDetailsApi={defaultAsyncState}
            clearPalletApi={defaultAsyncState}
            displayClearConfirmation={false}
            setDisplayClearConfirmation={jest.fn()}
            isPickerShow={false}
            setIsPickerShow={jest.fn()}
            perishableCategories={[]}
            displayWarningModal={false}
            setDisplayWarningModal={jest.fn()}
            useFocusEffectHook={jest.fn()}
            useCallbackHook={jest.fn()}
            confirmBackNavigate={false}
            setConfirmBackNavigate={jest.fn()}
            createPallet={false}
            postCreatePalletApi={defaultAsyncState}
            userConfigs={mockConfig}
            countryCode={mockCountryCode}
            trackEventCall={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });
      it('Renders the PalletManagement with warning modal ', () => {
        const renderer = ShallowRenderer.createRenderer();

        renderer.render(
          <ManagePalletScreen
            useEffectHook={jest.fn}
            isManualScanEnabled={true}
            palletInfo={mockPalletInfo}
            items={mockItems}
            navigation={navigationProp}
            route={routeProp}
            dispatch={jest.fn()}
            getItemDetailsApi={defaultAsyncState}
            addPalletUpcApi={defaultAsyncState}
            updateItemQtyAPI={defaultAsyncState}
            deleteUpcsApi={defaultAsyncState}
            getPalletDetailsApi={defaultAsyncState}
            clearPalletApi={defaultAsyncState}
            displayClearConfirmation={false}
            setDisplayClearConfirmation={jest.fn()}
            isPickerShow={false}
            setIsPickerShow={jest.fn()}
            perishableCategories={[]}
            displayWarningModal={true}
            setDisplayWarningModal={jest.fn()}
            useFocusEffectHook={jest.fn()}
            useCallbackHook={jest.fn()}
            confirmBackNavigate={false}
            setConfirmBackNavigate={jest.fn()}
            createPallet={false}
            postCreatePalletApi={defaultAsyncState}
            userConfigs={mockConfig}
            countryCode={mockCountryCode}
            trackEventCall={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

      it('Renders the PalletManagement with Clear Pallet Confirmation Modal ', () => {
        const renderer = ShallowRenderer.createRenderer();

        renderer.render(
          <ManagePalletScreen
            useEffectHook={jest.fn}
            isManualScanEnabled={true}
            palletInfo={mockPalletInfo}
            items={mockItems}
            navigation={navigationProp}
            route={routeProp}
            dispatch={jest.fn()}
            getItemDetailsApi={defaultAsyncState}
            addPalletUpcApi={defaultAsyncState}
            updateItemQtyAPI={defaultAsyncState}
            deleteUpcsApi={defaultAsyncState}
            getPalletDetailsApi={defaultAsyncState}
            clearPalletApi={defaultAsyncState}
            displayClearConfirmation={true}
            setDisplayClearConfirmation={jest.fn()}
            isPickerShow={false}
            setIsPickerShow={jest.fn()}
            perishableCategories={[]}
            displayWarningModal={false}
            setDisplayWarningModal={jest.fn()}
            useFocusEffectHook={jest.fn()}
            useCallbackHook={jest.fn()}
            confirmBackNavigate={false}
            setConfirmBackNavigate={jest.fn()}
            createPallet={false}
            postCreatePalletApi={defaultAsyncState}
            userConfigs={mockConfig}
            countryCode={mockCountryCode}
            trackEventCall={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

      it('Renders the DatePicker Dialog when the isPickerShow is true ', () => {
        const mockDate = new Date(1647369000000);
        jest
          .spyOn(global, 'Date')
          .mockImplementation(() => mockDate as unknown as string);

        const renderer = ShallowRenderer.createRenderer();
        renderer.render(
          <ManagePalletScreen
            useEffectHook={jest.fn}
            isManualScanEnabled={true}
            palletInfo={mockPalletInfo}
            items={mockItems}
            navigation={navigationProp}
            route={routeProp}
            dispatch={jest.fn()}
            getItemDetailsApi={defaultAsyncState}
            addPalletUpcApi={defaultAsyncState}
            updateItemQtyAPI={defaultAsyncState}
            deleteUpcsApi={defaultAsyncState}
            getPalletDetailsApi={defaultAsyncState}
            clearPalletApi={defaultAsyncState}
            displayClearConfirmation={true}
            setDisplayClearConfirmation={jest.fn()}
            isPickerShow={true}
            setIsPickerShow={jest.fn()}
            perishableCategories={[]}
            displayWarningModal={false}
            setDisplayWarningModal={jest.fn()}
            useFocusEffectHook={jest.fn()}
            useCallbackHook={jest.fn()}
            confirmBackNavigate={false}
            setConfirmBackNavigate={jest.fn()}
            createPallet={false}
            postCreatePalletApi={defaultAsyncState}
            userConfigs={mockConfig}
            countryCode={mockCountryCode}
            trackEventCall={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

      it('Renders the palletManagement when expiration date got modified', () => {
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(
          <ManagePalletScreen
            useEffectHook={jest.fn}
            isManualScanEnabled={true}
            palletInfo={mockPalletInfo}
            items={mockItems}
            navigation={navigationProp}
            route={routeProp}
            dispatch={jest.fn()}
            getItemDetailsApi={defaultAsyncState}
            addPalletUpcApi={defaultAsyncState}
            updateItemQtyAPI={defaultAsyncState}
            deleteUpcsApi={defaultAsyncState}
            getPalletDetailsApi={defaultAsyncState}
            clearPalletApi={defaultAsyncState}
            displayClearConfirmation={true}
            setDisplayClearConfirmation={jest.fn()}
            isPickerShow={false}
            setIsPickerShow={jest.fn()}
            perishableCategories={[]}
            displayWarningModal={false}
            setDisplayWarningModal={jest.fn()}
            useFocusEffectHook={jest.fn()}
            useCallbackHook={jest.fn()}
            confirmBackNavigate={false}
            setConfirmBackNavigate={jest.fn()}
            createPallet={false}
            postCreatePalletApi={defaultAsyncState}
            userConfigs={mockConfig}
            countryCode={mockCountryCode}
            trackEventCall={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

      it('Renders the expiration date required text if pallet has no date with perishableItems', () => {
        const renderer = ShallowRenderer.createRenderer();
        const mockPalletNoDate: PalletInfo = {
          id: '2',
          createDate: '03/31/2022'
        };
        renderer.render(
          <ManagePalletScreen
            useEffectHook={jest.fn}
            isManualScanEnabled={true}
            palletInfo={mockPalletNoDate}
            items={mockItems}
            navigation={navigationProp}
            route={routeProp}
            dispatch={jest.fn()}
            getItemDetailsApi={defaultAsyncState}
            addPalletUpcApi={defaultAsyncState}
            updateItemQtyAPI={defaultAsyncState}
            deleteUpcsApi={defaultAsyncState}
            getPalletDetailsApi={defaultAsyncState}
            clearPalletApi={defaultAsyncState}
            displayClearConfirmation={true}
            setDisplayClearConfirmation={jest.fn()}
            isPickerShow={false}
            setIsPickerShow={jest.fn()}
            perishableCategories={[]}
            displayWarningModal={false}
            setDisplayWarningModal={jest.fn()}
            useFocusEffectHook={jest.fn()}
            useCallbackHook={jest.fn()}
            confirmBackNavigate={false}
            setConfirmBackNavigate={jest.fn()}
            createPallet={false}
            postCreatePalletApi={defaultAsyncState}
            userConfigs={mockConfig}
            countryCode={mockCountryCode}
            trackEventCall={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });
    });
  });

  describe('Manage pallet externalized function tests', () => {
    const mockDispatch = jest.fn();
    const mockTrackEventCall = jest.fn();
    const mockPalletItem = mockItems[0];
    const palletInfo: PalletInfo = {
      id: '3'
    };

    const onSuccessApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: '',
        status: 200
      }
    };
    const onFailureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Request failed validation, 400'
    };

    afterEach(() => {
      jest.clearAllMocks();
      // Resets methods overwritten with jest.spyOn
      jest.restoreAllMocks();
    });

    it('tests getNumberOfDeleted', () => {
      const deletedResult = getNumberOfDeleted(mockItems);

      expect(deletedResult).toBe(1);
    });

    it('tests isQuantityChanged', () => {
      const falseResult = isQuantityChanged(mockItems[0]);

      expect(falseResult).toBe(false);

      const trueResult = isQuantityChanged(mockItems[1]);

      expect(trueResult).toBe(true);
    });

    it('tests decreaseQuantity', () => {
      handleDecreaseQuantity(mockItems[2], mockDispatch);
      expect(mockDispatch).toBeCalledTimes(0);

      handleDecreaseQuantity(mockItems[1], mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests increaseQuantity', () => {
      handleIncreaseQuantity(mockItems[0], mockDispatch);

      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests quantity textChange', () => {
      handleTextChange(mockItems[0], mockDispatch, '0');
      expect(mockDispatch).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(0);

      handleTextChange(mockItems[0], mockDispatch, '12');
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(0);
      mockDispatch.mockClear();

      handleTextChange(mockItems[0], mockDispatch, '-1');
      expect(mockDispatch).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(1);
    });

    it('tests handleUpdateItems calls dispatch if added/deleted flags are false and has newQty', () => {
      const items = [...mockItems];
      handleUpdateItems(items, palletInfo, mockDispatch, mockTrackEventCall);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockTrackEventCall).toBeCalledTimes(1);
    });

    it('tests handleUpdateItems does not call dispatch if either add/deleted flag is true or has no newQty', () => {
      const items = [
        { ...mockItems[0], deleted: false },
        { ...mockItems[1], added: true },
        { ...mockItems[2], deleted: true }
      ];
      handleUpdateItems(items, palletInfo, mockDispatch, mockTrackEventCall);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockTrackEventCall).not.toHaveBeenCalled();
    });

    it('tests handleUpdateItems dispatches when expiration date changed', () => {
      const items: PalletItem[] = [];
      palletInfo.expirationDate = '03/07/2023';
      palletInfo.newExpirationDate = '03/05/2023';
      handleUpdateItems(items, palletInfo, mockDispatch, mockTrackEventCall);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockTrackEventCall).toBeCalledTimes(1);
    });

    it('tests handleUpdateItems doesnt dispatch when expiry date changed back', () => {
      const items: PalletItem[] = [];
      palletInfo.newExpirationDate = '03/07/2023';
      handleUpdateItems(items, palletInfo, mockDispatch, mockTrackEventCall);
      expect(mockDispatch).toBeCalledTimes(0);
      expect(mockTrackEventCall).toBeCalledTimes(0);
    });

    it('Calls dispatch if the "added" flag is true for at least one palletItem', () => {
      const mockAddPallet: PalletItem[] = [
        ...mockItems,
        {
          ...mockItems[1],
          added: true
        }
      ];
      handleAddItems(
        palletInfo.id,
        mockAddPallet,
        mockDispatch,
        mockTrackEventCall
      );
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockTrackEventCall).toHaveBeenCalled();
    });

    it('Does not call dispatch if the "added" flag is false for all palletItems', () => {
      handleAddItems(
        palletInfo.id,
        mockItems,
        mockDispatch,
        mockTrackEventCall
      );
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockTrackEventCall).not.toHaveBeenCalled();
    });

    it('Tests getPalletDetailsApiHook on success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            pallets: [
              {
                id: 1,
                createDate: '2022-01-01T12:00:00.000Z',
                expirationDate: '01/05/2022',
                items: []
              }
            ]
          }
        }
      };

      getPalletDetailsApiHook(successApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(3);
      expect(Toast.show).toBeCalledTimes(0);
    });

    it('Tests getPalletDetailsApiHook on success 204 ', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 204,
          data: {}
        }
      };

      getPalletDetailsApiHook(successApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
    });

    it('Tests getPalletDetailsApiHook on fail', () => {
      const failApi: AsyncState = { ...defaultAsyncState, error: {} };

      getPalletDetailsApiHook(failApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
    });

    it('Tests getPalletDetailsApiHook on api loading', () => {
      const apiIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      getPalletDetailsApiHook(apiIsWaiting, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests updatePalletApisHook isLoading', () => {
      const apiIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      updatePalletApisHook(
        apiIsWaiting,
        defaultAsyncState,
        defaultAsyncState,
        mockItems,
        mockDispatch,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });
    it('Tests updatePalletApisHook with Successful responses', () => {
      const successToastProps = {
        type: 'success',
        text1: strings('PALLET.SAVE_PALLET_SUCCESS'),
        position: 'bottom'
      };
      mockItems[0].added = true;
      updatePalletApisHook(
        onSuccessApi,
        onSuccessApi,
        onSuccessApi,
        mockItems,
        mockDispatch,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(6);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(updatePalletExpirationDate).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(successToastProps)
      );
      // Reset to default
      mockItems[0].added = false;
    });
    it('Tests updatePalletApisHook with Partial successful and error responses', () => {
      const partialToastProps = {
        type: 'info',
        text1: strings('PALLET.SAVE_PALLET_PARTIAL'),
        text2: strings(TRY_AGAIN_TEXT),
        position: 'bottom'
      };
      updatePalletApisHook(
        onFailureApi,
        onSuccessApi,
        onFailureApi,
        mockItems,
        mockDispatch,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(updatePalletExpirationDate).toBeCalledTimes(0);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(partialToastProps)
      );
    });

    it('Tests updatePalletApisHook should not call updatePalletExpirationDate when exp date is not changed', () => {
      const successToastProps = {
        type: 'success',
        text1: strings('PALLET.SAVE_PALLET_SUCCESS'),
        position: 'bottom'
      };
      updatePalletApisHook(
        onSuccessApi,
        onSuccessApi,
        onSuccessApi,
        mockItems,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(updatePalletExpirationDate).not.toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(successToastProps)
      );
    });

    it('Tests updatePalletApisHook with all error responses', () => {
      const errorToastProps = {
        type: 'error',
        text1: strings('PALLET.SAVE_PALLET_FAILURE'),
        text2: strings(TRY_AGAIN_TEXT),
        position: 'bottom'
      };
      updatePalletApisHook(
        onFailureApi,
        onFailureApi,
        onFailureApi,
        mockItems,
        mockDispatch,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(errorToastProps)
      );
    });

    it('Tests postCreatePalletApiHook isLoading', () => {
      const apiIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      postCreatePalletApiHook(
        apiIsWaiting,
        mockDispatch,
        navigationProp,
        mockItems,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });
    it('Tests postCreatePalletApiHook with Successful responses', () => {
      const successToastProps = {
        type: 'success',
        text1: strings('PALLET.CREATE_PALLET_SUCCESS'),
        position: 'bottom'
      };
      const onCreatePalletSuccessApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: [{ palletId: 1 }],
          status: 200
        }
      };
      postCreatePalletApiHook(
        onCreatePalletSuccessApi,
        mockDispatch,
        navigationProp,
        mockItems,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(6);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(successToastProps)
      );
    });

    it('Tests postCreatePalletApiHook with error responses', () => {
      const errorToastProps = {
        type: 'error',
        text1: strings('PALLET.CREATE_PALLET_FAILED'),
        position: 'bottom'
      };
      postCreatePalletApiHook(
        onFailureApi,
        mockDispatch,
        navigationProp,
        mockItems,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(errorToastProps)
      );
    });

    it('Test clearPalletApi hook on success', () => {
      const clearPalletSuccess: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 204
        }
      };
      const mockSetDisplayConfirmation = jest.fn();
      const mockSetNavigateConfirmation = jest.fn();
      const successToast = {
        type: 'success',
        text1: strings('PALLET.CLEAR_PALLET_SUCCESS', { palletId: palletInfo }),
        position: 'bottom'
      };
      clearPalletApiHook(
        clearPalletSuccess,
        palletInfo.id,
        navigationProp,
        mockDispatch,
        mockSetDisplayConfirmation,
        mockSetNavigateConfirmation
      );

      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetDisplayConfirmation).toHaveBeenCalledWith(false);
      expect(mockSetNavigateConfirmation).toHaveBeenCalledWith(true);
      expect(Toast.show).toHaveBeenCalledWith(successToast);
    });

    it('Test clearPalletApi hook on failure', () => {
      const clearPalletFailure: AsyncState = {
        ...defaultAsyncState,
        error: 'Error communicating with SOAP service'
      };
      // mock navigate go back
      const mockSetDisplayConfirmation = jest.fn();
      const mockSetNavigateConfirmation = jest.fn();
      const failedToast = {
        type: 'error',
        text1: strings('PALLET.CLEAR_PALLET_ERROR'),
        text2: strings(TRY_AGAIN_TEXT),
        position: 'bottom'
      };
      clearPalletApiHook(
        clearPalletFailure,
        palletInfo.id,
        navigationProp,
        mockDispatch,
        mockSetDisplayConfirmation,
        mockSetNavigateConfirmation
      );
      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetDisplayConfirmation).toHaveBeenCalledWith(false);
      expect(Toast.show).toHaveBeenCalledWith(failedToast);
    });

    it('Test clearPalletApi hook on api is loading', () => {
      const clearPalletApiIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      // mock navigate go back
      const mockSetDisplayConfirmation = jest.fn();
      const mockSetNavigateConfirmation = jest.fn();
      clearPalletApiHook(
        clearPalletApiIsWaiting,
        palletInfo.id,
        navigationProp,
        mockDispatch,
        mockSetDisplayConfirmation,
        mockSetNavigateConfirmation
      );

      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests isExpiryDateChanged', () => {
      // expiry date has a space at the end of it from the service
      // for one reason or another
      palletInfo.expirationDate = '12/25/2024 ';
      palletInfo.newExpirationDate = undefined;
      const unsetExpirationDate = isExpiryDateChanged(palletInfo);

      palletInfo.newExpirationDate = '12/11/2024';
      const setExpirationDate = isExpiryDateChanged(palletInfo);

      palletInfo.newExpirationDate = '12/25/2024';
      const expirationDateSetBackToOld = isExpiryDateChanged(palletInfo);

      expect(unsetExpirationDate).toBe(false);
      expect(setExpirationDate).toBe(true);
      expect(expirationDateSetBackToOld).toBe(false);
    });

    it('Tests getItemDetailsApiHook on 200 success if item already exists', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: mockItems[0],
          status: 200
        }
      };
      const toastItemExists = {
        type: 'info',
        text1: strings('PALLET.ITEMS_DETAILS_EXIST'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      getItemDetailsApiHook(successApi, mockItems, mockDispatch);
      expect(Toast.show).toHaveBeenCalledWith(toastItemExists);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests getItemDetailsApiHook on 200 success for a new item', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            itemDetails: getItemDetails[123],
            itemOhChangeHistory: { code: 204 },
            picklistHistory: { code: 204 }
          },
          status: 200
        }
      };
      getItemDetailsApiHook(successApi, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('Tests getItemDetailsApiHook on 204 success for a new item', () => {
      const successApi204: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 204
        }
      };
      const toastItemNotFound = {
        type: 'info',
        text1: strings('PALLET.ITEMS_NOT_FOUND'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      getItemDetailsApiHook(successApi204, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastItemNotFound);
    });

    it('Tests getItemDetailsApi on failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Internal Server Error'
      };
      const toastGetItemError = {
        type: 'error',
        text1: strings('PALLET.ITEMS_DETAILS_ERROR'),
        text2: strings(TRY_AGAIN_TEXT),
        visibilityTime: 4000,
        position: 'bottom'
      };
      getItemDetailsApiHook(failureApi, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastGetItemError);
    });

    it('Tests getItemDetailsApi isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      getItemDetailsApiHook(isLoadingApi, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests isAddedItemPerishable', () => {
      const mockPerishableCatg: number[] = [1, 8, 54, 72, 93];
      const isAddedFalse = isAddedItemPerishable(mockItems, mockPerishableCatg);
      expect(isAddedFalse).toBe(false);

      const mockAddedItems: PalletItem[] = [
        {
          itemNbr: 1234,
          upcNbr: '1234567890',
          itemDesc: 'test',
          quantity: 3,
          newQuantity: 3,
          price: 10.0,
          categoryNbr: 8,
          categoryDesc: 'test cat',
          deleted: false,
          added: true
        },
        {
          itemNbr: 1234,
          upcNbr: '12345678901',
          itemDesc: 'test',
          quantity: 3,
          newQuantity: 4,
          price: 10.0,
          categoryNbr: 54,
          categoryDesc: 'test cat',
          deleted: false,
          added: true
        }
      ];
      const isAddedTrue = isAddedItemPerishable(
        mockAddedItems,
        mockPerishableCatg
      );
      expect(isAddedTrue).toBe(true);
    });
    it('Tests removeExpirationDate function', () => {
      const mockPerishableCategories = [1, 10, 11];
      expect(removeExpirationDate(mockItems, mockPerishableCategories)).toBe(
        false
      );
      const newItems: PalletItem[] = [
        {
          itemNbr: 1234,
          upcNbr: '1234567890',
          itemDesc: 'test',
          quantity: 3,
          newQuantity: 3,
          price: 10.0,
          categoryDesc: 'test cat',
          deleted: true,
          added: false,
          categoryNbr: 1
        },
        {
          itemNbr: 4221,
          upcNbr: '765432123456',
          itemDesc: 'food',
          quantity: 2,
          newQuantity: 1,
          price: 3.49,
          categoryDesc: 'deli',
          deleted: false,
          added: false,
          categoryNbr: 8
        }
      ];
      expect(removeExpirationDate(newItems, mockPerishableCategories)).toBe(
        true
      );
    });

    it('Tests barcodeEmitterHook function', () => {
      barCodeEmitterProp.addListener = jest
        .fn()
        .mockImplementation((event, callBack) => {
          callBack();
        });
      barcodeEmitterHook(
        barCodeEmitterProp,
        navigationProp,
        routeProp,
        mockDispatch,
        mockTrackEventCall
      );
      expect(barCodeEmitterProp.addListener).toBeCalledWith(
        'scanned',
        expect.any(Function)
      );
      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(validateSession).toHaveBeenCalled();
    });

    it('Tests onEndEditing function', () => {
      // @ts-expect-error test requires newQuanity to not be a number
      mockPalletItem.newQuantity = undefined;
      onEndEditing(mockPalletItem, mockDispatch);
      expect(
        mockDispatch(
          setPalletItemNewQuantity(
            mockPalletItem.itemNbr.toString(),
            mockPalletItem.quantity
          )
        )
      );
      mockPalletItem.newQuantity = 3;
    });

    it('Tests isPerishableItemDeleted function', () => {
      const isPerishableResponse = isPerishableItemDeleted(mockItems, []);
      expect(isPerishableResponse).toStrictEqual(false);
    });

    it('Tests deleteItemDetail function', () => {
      mockPalletItem.added = true;
      deleteItemDetail(mockPalletItem, mockDispatch);
      expect(mockDispatch(removeItem(mockPalletItem.itemNbr.toString())));

      mockPalletItem.added = false;
      deleteItemDetail(mockPalletItem, mockDispatch);
      expect(mockDispatch(deleteItem(mockPalletItem.itemNbr.toString())));
    });

    it('Tests undoDelete function', () => {
      undoDelete(mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith(resetItems());
    });

    it('Tests FlatList ItemCard render function', () => {
      const itemCardRender = itemCard(
        { item: { ...mockPalletItem, deleted: false } },
        mockDispatch,
        mockConfig,
        'MX',
        mockTrackEventCall
      );
      expect(itemCardRender).not.toBeNull();

      mockPalletItem.deleted = true;
      const itemCardRendesNull = itemCard(
        { item: mockPalletItem },
        mockDispatch,
        mockConfig,
        'MX',
        mockTrackEventCall
      );
      expect(itemCardRendesNull).toBeNull();
      // set mock pallet back to default
      mockPalletItem.deleted = false;
    });

    it('Tests onValidateHardwareBackPress function', () => {
      const mockSetWarnDisplay = jest.fn();
      expect(
        onValidateHardwareBackPress(mockSetWarnDisplay, true)
      ).toStrictEqual(true);
      expect(mockSetWarnDisplay).toHaveBeenCalled();
      expect(
        onValidateHardwareBackPress(mockSetWarnDisplay, false)
      ).toStrictEqual(false);
    });

    it('Tests backHandlerEventHook function', () => {
      const backHandlerProp: BackHandlerStatic = {
        exitApp: jest.fn(),
        addEventListener: jest.fn().mockImplementation(
          (event, callBack: () => boolean | null | undefined) => {
            callBack();
          }
        ),
        removeEventListener: jest.fn().mockImplementation((event, callBack) => {
          callBack();
        })
      };
      const mockSetWarnDisplay = jest.fn();
      backHandlerEventHook(
        backHandlerProp,
        mockSetWarnDisplay,
        mockItems,
        mockPalletInfo
      );
      expect(backHandlerProp.addEventListener).toBeCalledWith(
        'hardwareBackPress',
        expect.any(Function)
      );
      expect(mockSetWarnDisplay).toHaveBeenCalled();
      expect(enableSave(mockItems, mockPalletInfo)).toStrictEqual(true);
    });

    it('Tests navListenerHook function', () => {
      type EventMapBase = Record<
        string,
        { data?: any; canPreventDefault?: boolean }
      >;

      navigationProp.addListener = jest
        .fn()
        .mockImplementation(
          (
            event,
            callBack: EventListenerCallback<EventMapBase, keyof EventMapBase>
          ) => {
            const eventObj: BeforeRemoveEvent = {
              data: {
                action: {
                  type: ''
                }
              },
              defaultPrevented: false,
              preventDefault: jest.fn(),
              type: 'beforeRemove'
            };
            callBack(eventObj);
          }
        );
      const mockSetWarnDisplay = jest.fn();

      navListenerHook(
        navigationProp,
        false,
        mockItems,
        mockPalletInfo,
        mockSetWarnDisplay,
        mockDispatch
      );
      expect(navigationProp.addListener).toBeCalledWith(
        'beforeRemove',
        expect.any(Function)
      );
      expect(mockSetWarnDisplay).toHaveBeenCalledWith(true);

      navListenerHook(
        navigationProp,
        true,
        mockItems,
        mockPalletInfo,
        mockSetWarnDisplay,
        mockDispatch
      );
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
