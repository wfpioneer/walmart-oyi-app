import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Route } from '@react-navigation/native';
import { LocationDetailsScreen } from './LocationDetailsScreen';
import { AsyncState } from '../../models/AsyncState';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

const SECTION_NAME = '1';
const ZONE_NAME = 'ABAR';
const AISLE_NAME = '2';

// TODO Adjust Snapshot naming convention Remove on final PR
describe('Test Location Details Screen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };

  const defaultRouteProp: Route<any> = {
    key: '',
    name: 'FloorDetails'
  };

  describe('Tests rendering location details screen data', () => {
    const sectionDetails: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: mockLocationDetails
      }
    };
    it('Renders Location Details Screen with Mock Floor Items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          sectionName={SECTION_NAME}
          zoneName={ZONE_NAME}
          aisleName={AISLE_NAME}
          getSectionDetailsApi={sectionDetails}
          dispatch={jest.fn()}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Details Screen with Mock Reserve Items', () => {
      const routePropReserve: Route<any> = {
        key: '',
        name: 'ReserveDetails'
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          sectionName={SECTION_NAME}
          zoneName={ZONE_NAME}
          aisleName={AISLE_NAME}
          getSectionDetailsApi={sectionDetails}
          dispatch={jest.fn()}
          route={routePropReserve}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Details Screen with Empty Mock Data', () => {
      const sectionDetailsEmpty: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: mockLocationDetailsEmpty
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          sectionName={SECTION_NAME}
          zoneName={ZONE_NAME}
          aisleName={AISLE_NAME}
          getSectionDetailsApi={sectionDetailsEmpty}
          dispatch={jest.fn()}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Details Screen with Mock Large Location Data', () => {
      const sectionDetailsLargeLocationCount: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: mockLocationDetailsLargeLocationCount
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          sectionName={SECTION_NAME}
          zoneName={ZONE_NAME}
          aisleName={AISLE_NAME}
          getSectionDetailsApi={sectionDetailsLargeLocationCount}
          dispatch={jest.fn()}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Get Section Details api responses', () => {
    it('Renders Location Details error message', () => {
      const getSectionDetailsError: AsyncState = {
        ...defaultAsyncState,
        error: 'NetWork Error'
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          sectionName={SECTION_NAME}
          zoneName={ZONE_NAME}
          aisleName={AISLE_NAME}
          getSectionDetailsApi={getSectionDetailsError}
          dispatch={jest.fn()}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Details activity indicator when waiting for an api response', () => {
      const getSectionDetailsIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          sectionName={SECTION_NAME}
          zoneName={ZONE_NAME}
          aisleName={AISLE_NAME}
          getSectionDetailsApi={getSectionDetailsIsWaiting}
          dispatch={jest.fn()}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
