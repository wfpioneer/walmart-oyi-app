import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { SectionDetailsScreen } from './SectionDetailsScreen';
import { AsyncState } from '../../models/AsyncState';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

let navigationProp: NavigationProp<any, string>;

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

  const defaultScannedEvent = {
    value: '',
    type: ''
  };

  describe('Tests rendering location details screen data', () => {
    const sectionDetails: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: mockLocationDetails
      }
    };

    it('Renders reserve list when reserve tab is selected', () => {
      const reserveSelectedRouteProp = { ...defaultRouteProp, name: 'ReserveDetails' };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={reserveSelectedRouteProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Details Screen with Mock Floor Items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
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
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routePropReserve}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
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
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetailsEmpty}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
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
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetailsLargeLocationCount}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
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
        <SectionDetailsScreen
          getSectionDetailsApi={getSectionDetailsError}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
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
        <SectionDetailsScreen
          getSectionDetailsApi={getSectionDetailsIsWaiting}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={defaultRouteProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
