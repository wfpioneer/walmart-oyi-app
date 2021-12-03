import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty
} from '../../mockData/locationDetails';
import { AsyncState } from '../../models/AsyncState';
import {
  ReserveSectionDetailsScreen,
  combineReserveArrays
} from './ReserveSectionDetails';
import {
  mockCombinedReserveData,
  mockPalletDetails
} from '../../mockData/getPalletDetails';

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
          addAPI={defaultAsyncState}
          palletIds={[]}
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
          addAPI={defaultAsyncState}
          palletIds={[]}
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
          addAPI={defaultAsyncState}
          palletIds={[]}
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
          addAPI={defaultAsyncState}
          palletIds={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Details activity indicator when waiting for an api response', () => {
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
          addAPI={defaultAsyncState}
          palletIds={[]}
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
});
