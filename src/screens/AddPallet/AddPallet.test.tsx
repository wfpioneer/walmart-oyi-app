import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AsyncState } from 'src/models/AsyncState';
import { AddPalletScreen, addPalletAPIHook } from './AddPallet';
import { defaultAsyncState } from '../../mockData/mockStore';
import { LocationIdName } from '../../state/reducers/Location';
import { getSectionDetails } from '../../state/actions/saga';
import { strings } from '../../locales';
import { showSnackBar } from '../../state/actions/SnackBar';
import { showInfoModal } from '../../state/actions/Modal';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: () => true,
  getParent: jest.fn(),
  getState: jest.fn(),
  getId: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};
describe('AddPalletScreen', () => {
  const renderer = ShallowRenderer.createRenderer();
  const invalidPalletID = '123abc';
  const validPalletID = '123456';
  const locationName = 'A1-1';
  const addPalletResult = {
    status: 204,
    data: ''
  };
  const getSectionEmptyResponse: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: addPalletResult
  };
  const mockSection: LocationIdName = {
    id: 1,
    name: 'A1-1'
  };
  it('Renders Error for pallet ID containing non number digits', () => {
    renderer.render(
      <AddPalletScreen
        palletId={invalidPalletID}
        updatePalletId={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        section={mockSection}
        addPalletAPI={getSectionEmptyResponse}
        locationName={locationName}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Enabled Submit button for pallet ID containing only numeric digits', () => {
    renderer.render(
      <AddPalletScreen
        palletId={validPalletID}
        updatePalletId={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        section={mockSection}
        locationName={locationName}
        addPalletAPI={getSectionEmptyResponse}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  describe('Rendering Add pallet API responses', () => {
    const apiIsWaiting = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    it('Renders the waiting for response from Add pallet API', () => {
      renderer.render(
        <AddPalletScreen
          palletId={validPalletID}
          updatePalletId={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          addPalletAPI={apiIsWaiting}
          section={mockSection}
          locationName={locationName}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the success response from Add pallet API', () => {
      renderer.render(
        <AddPalletScreen
          palletId={validPalletID}
          updatePalletId={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          addPalletAPI={getSectionEmptyResponse}
          section={mockSection}
          locationName={locationName}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Tests addPalletAPIHook', () => {
      const mockDispatch = jest.fn();
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            assignPalletToSectionResponse: {
              code: 200
            },
            completePicklistResponse: {
              code: 204
            },
            completeWorklistResponse: {
              code: 204
            }
          }
        }
      };
      const error409Api: AsyncState = {
        ...defaultAsyncState,
        error: 'Request failed with status code 409'
      };
      const errorApi: AsyncState = {
        ...defaultAsyncState,
        error: 'NetWork Error'
      };

      addPalletAPIHook(successApi, mockDispatch, navigationProp, mockSection);
      expect(navigationProp.goBack).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(
        1,
        getSectionDetails({ sectionId: '1' })
      );
      expect(mockDispatch).toHaveBeenNthCalledWith(
        2,
        showSnackBar(strings('LOCATION.PALLET_ADDED'), 3000)
      );
      jest.clearAllMocks();

      successApi.result.data.assignPalletToSectionResponse.code = 204;
      addPalletAPIHook(successApi, mockDispatch, navigationProp, mockSection);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        showInfoModal(
          strings('LOCATION.PALLET_ERROR'),
          strings('LOCATION.PALLET_NOT_FOUND')
        )
      );
      jest.clearAllMocks();

      addPalletAPIHook(error409Api, mockDispatch, navigationProp, mockSection);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        showInfoModal(
          strings('LOCATION.PALLET_ERROR'),
          strings('LOCATION.PALLET_NOT_FOUND')
        )
      );
      jest.clearAllMocks();

      addPalletAPIHook(errorApi, mockDispatch, navigationProp, mockSection);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        showInfoModal(
          strings('LOCATION.ADD_PALLET_ERROR'),
          strings('LOCATION.ADD_PALLET_API_ERROR')
        )
      );
      jest.clearAllMocks();
    });
  });
});
