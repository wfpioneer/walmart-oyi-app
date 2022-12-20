import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty
} from '../../mockData/locationDetails';
import { AsyncState } from '../../models/AsyncState';
import {
  ReserveSectionDetailsScreen,
  combineReserveArrays,
  getPalletConfigHook,
  getPalletDetailsApiHook,
  showActivitySpinner
} from './ReserveSectionDetails';
import {
  mockCombinedReserveData,
  mockPalletDetails
} from '../../mockData/getPalletDetails';
import { ReserveDetailsPallet } from '../../models/LocationItems';
import { mockConfig } from '../../mockData/mockConfig';
import { strings } from '../../locales';
import { SNACKBAR_TIMEOUT, SNACKBAR_TIMEOUT_LONG } from '../../utils/global';

let navigationProp: NavigationProp<any, string>;
describe('Tests Reserve Section Details Screen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };

  describe('Tests rendering Reserve Section details screen data', () => {
    const sectionDetails: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: mockLocationDetails
      }
    };
    const palletDetails: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: {
          pallets: mockPalletDetails
        }
      }
    };
    it('Renders Reserve Details Screen with Mock Reserve Items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReserveSectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          getPalletDetailsApi={palletDetails}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          palletIds={[]}
          getPalletConfigApi={defaultAsyncState}
          getPalletDetailsComplete={false}
          configComplete={false}
          setConfigComplete={jest.fn()}
          setGetPalletDetailsComplete={jest.fn()}
          palletClicked={false}
          setPalletClicked={jest.fn()}
          userConfig={mockConfig}
          perishableCategories={[]}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          palletInfo={{ id: '1234' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders List Empty Component if sectionDetails returns with no data', () => {
      const sectionDetailsEmpty: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: mockLocationDetailsEmpty
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReserveSectionDetailsScreen
          getSectionDetailsApi={sectionDetailsEmpty}
          getPalletDetailsApi={palletDetails}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          palletIds={[]}
          getPalletConfigApi={defaultAsyncState}
          getPalletDetailsComplete={false}
          configComplete={false}
          setConfigComplete={jest.fn()}
          setGetPalletDetailsComplete={jest.fn()}
          palletClicked={false}
          setPalletClicked={jest.fn()}
          userConfig={mockConfig}
          perishableCategories={[]}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          palletInfo={{ id: '1234' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders List Empty Component if palletDetails returns with no data', () => {
      const palletDetailsEmpty: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            pallets: []
          }
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReserveSectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          getPalletDetailsApi={palletDetailsEmpty}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          palletIds={[]}
          getPalletConfigApi={defaultAsyncState}
          getPalletDetailsComplete={false}
          configComplete={false}
          setConfigComplete={jest.fn()}
          setGetPalletDetailsComplete={jest.fn()}
          palletClicked={false}
          setPalletClicked={jest.fn()}
          userConfig={mockConfig}
          perishableCategories={[]}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          palletInfo={{ id: '1234' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Get Section Details api responses', () => {
    it('Renders Location Details error message', () => {
      const getPalletDetailsError: AsyncState = {
        ...defaultAsyncState,
        error: 'NetWork Error'
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReserveSectionDetailsScreen
          getSectionDetailsApi={defaultAsyncState}
          getPalletDetailsApi={getPalletDetailsError}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          palletIds={[]}
          getPalletConfigApi={defaultAsyncState}
          getPalletDetailsComplete={false}
          configComplete={false}
          setConfigComplete={jest.fn()}
          setGetPalletDetailsComplete={jest.fn()}
          palletClicked={false}
          setPalletClicked={jest.fn()}
          userConfig={mockConfig}
          perishableCategories={[]}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          palletInfo={{ id: '1234' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders activity indicator when waiting for get pallet details api response', () => {
      const getPalletDetailsIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReserveSectionDetailsScreen
          getSectionDetailsApi={defaultAsyncState}
          getPalletDetailsApi={getPalletDetailsIsWaiting}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          palletIds={[]}
          getPalletConfigApi={defaultAsyncState}
          getPalletDetailsComplete={false}
          configComplete={false}
          setConfigComplete={jest.fn()}
          setGetPalletDetailsComplete={jest.fn()}
          palletClicked={false}
          setPalletClicked={jest.fn()}
          userConfig={mockConfig}
          perishableCategories={[]}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          palletInfo={{ id: '1234' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders activity indicator when waiting for get section details api response', () => {
      const getSectionDetailsIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReserveSectionDetailsScreen
          getSectionDetailsApi={getSectionDetailsIsWaiting}
          getPalletDetailsApi={defaultAsyncState}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          palletIds={[]}
          getPalletConfigApi={defaultAsyncState}
          getPalletDetailsComplete={false}
          configComplete={false}
          setConfigComplete={jest.fn()}
          setGetPalletDetailsComplete={jest.fn()}
          palletClicked={false}
          setPalletClicked={jest.fn()}
          userConfig={mockConfig}
          perishableCategories={[]}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          palletInfo={{ id: '1234' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('CombinedReserveArray Function Tests', () => {
    const { palletData } = mockLocationDetails.pallets;
    it('Returns new Reserved Pallet Array with Mapped ids ', () => {
      const reservedArr = combineReserveArrays(mockPalletDetails, palletData);
      expect(reservedArr).toStrictEqual(mockCombinedReserveData);
    });
    it('Returns Empty Array if one prop is undefined ', () => {
      const emptyArray = combineReserveArrays(undefined, palletData);
      expect(emptyArray).toStrictEqual([]);
    });
  });
  describe('Manage pallet externalized function tests', () => {
    const mockDispatch = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockSetGetPalletDetailsComplete = jest.fn();
    const mockSetPalletClicked = jest.fn();
    let mockReservePallets: ReserveDetailsPallet[] | undefined = [];

    it('Tests getPalletDetailsApiHook on success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            pallets: [
              {
                id: 1,
                createDate: 'today',
                expirationDate: 'tomorrow',
                items: []
              }
            ]
          }
        }
      };

      getPalletDetailsApiHook(
        successApi, mockReservePallets, true, mockSetPalletClicked, mockDispatch, mockSetGetPalletDetailsComplete
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(0);
      expect(mockSetPalletClicked).toHaveBeenCalledWith(false);
      expect(mockSetGetPalletDetailsComplete).toHaveBeenCalledWith(true);
    });

    it('Tests getPalletDetailsApiHook with failed pallets and status 207', () => {
      const failApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 207,
          data: {}
        }
      };

      mockReservePallets = [{
        statusCode: 204,
        id: 60,
        createDate: 'today',
        expirationDate: 'tomorrow',
        items: [],
        palletCreateTS: '2022-06-05T00:20:00Z',
        palletId: '60'
      }];
      getPalletDetailsApiHook(
        failApi, mockReservePallets, false, mockSetPalletClicked, mockDispatch, mockSetGetPalletDetailsComplete
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('LOCATION.GET_FAILED_PALLETS', { amount: 1 }),
        visibilityTime: SNACKBAR_TIMEOUT_LONG,
        position: 'bottom'
      });
    });
    it('Tests getPalletDetailsApiHook with status 204', () => {
      const apiResult: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 204,
          data: {}
        }
      };

      getPalletDetailsApiHook(
        apiResult, mockReservePallets, false, mockSetPalletClicked, mockDispatch, mockSetGetPalletDetailsComplete
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });

    it('Tests getPalletDetailsApiHook on fail', () => {
      const failApi: AsyncState = { ...defaultAsyncState, error: {} };
      getPalletDetailsApiHook(
        failApi, mockReservePallets, false, mockSetPalletClicked, mockDispatch, mockSetGetPalletDetailsComplete
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('PALLET.PALLET_DETAILS_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });
    it('test getPalletConfigHook', async () => {
      const dispatch = jest.fn();
      const setConfigComplete = jest.fn();
      const successAsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            perishableCategories: [1, 8, 35, 36, 40, 41, 43, 45, 46, 47, 49, 51, 52, 53, 54, 55, 58]
          }
        }
      };
      const failureAsyncState = {
        ...defaultAsyncState,
        error: 'test'
      };

      getPalletConfigHook(successAsyncState, dispatch, setConfigComplete, '1, 8');
      expect(dispatch).toBeCalledTimes(2);
      expect(setConfigComplete).toBeCalledTimes(1);

      dispatch.mockReset();
      setConfigComplete.mockReset();
      getPalletConfigHook(failureAsyncState, dispatch, setConfigComplete, '1, 8');
      expect(dispatch).toBeCalledTimes(2);
      expect(setConfigComplete).toBeCalledTimes(1);
    });
    it('test showAactivitySpinner functionality', () => {
      let mockConfigWaiting = true;
      let mockGetPalletDetailsWaiting = false;
      let mockGetPalletDetailsComplete = true;
      let mockGetSectionDetailsWaiting = false;
      let result = showActivitySpinner(
        mockConfigWaiting, mockGetPalletDetailsWaiting, mockGetPalletDetailsComplete, mockGetSectionDetailsWaiting
      );
      expect(result).toStrictEqual(true);

      mockConfigWaiting = false;
      mockGetPalletDetailsWaiting = true;
      mockGetPalletDetailsComplete = false;
      mockGetSectionDetailsWaiting = false;
      result = showActivitySpinner(
        mockConfigWaiting, mockGetPalletDetailsWaiting, mockGetPalletDetailsComplete, mockGetSectionDetailsWaiting
      );
      expect(result).toStrictEqual(true);

      mockGetPalletDetailsWaiting = false;
      mockGetSectionDetailsWaiting = true;
      result = showActivitySpinner(
        mockConfigWaiting, mockGetPalletDetailsWaiting, mockGetPalletDetailsComplete, mockGetSectionDetailsWaiting
      );
      expect(result).toStrictEqual(true);

      mockGetSectionDetailsWaiting = false;
      result = showActivitySpinner(
        mockConfigWaiting, mockGetPalletDetailsWaiting, mockGetPalletDetailsComplete, mockGetSectionDetailsWaiting
      );
      expect(result).toStrictEqual(false);

      mockGetPalletDetailsComplete = true;
      result = showActivitySpinner(
        mockConfigWaiting, mockGetPalletDetailsWaiting, mockGetPalletDetailsComplete, mockGetSectionDetailsWaiting
      );
      expect(result).toStrictEqual(true);
    });
  });
});
