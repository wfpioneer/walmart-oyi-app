import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { SectionDetailsScreen, handleEditItem } from './SectionDetailsScreen';
import { AsyncState } from '../../models/AsyncState';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';
import { SectionDetailsItem } from '../../models/LocationItems';
import { LocationIdName } from '../../state/reducers/Location';

let navigationProp: NavigationProp<any, string>;

// TODO Adjust Snapshot naming convention Remove on final PR
describe('Test Location Details Screen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };

  const defaultScannedEvent = {
    value: '',
    type: ''
  };

  const defaultSelectedItem: SectionDetailsItem = {
    itemNbr: 1234,
    upcNbr: '123456789',
    itemDesc: 'test',
    price: 10.00,
    locationType: 8
  };

  const defaultSection: LocationIdName = {
    id: 1,
    name: 'test'
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
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          deleteLocationApi={defaultAsyncState}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
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
          deleteLocationApi={defaultAsyncState}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
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
          deleteLocationApi={defaultAsyncState}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
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
          deleteLocationApi={defaultAsyncState}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
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
          deleteLocationApi={defaultAsyncState}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Section Not found when getSectionDetails responds with a 204 status code', () => {
      const getSectionDetailsEmpty: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 204
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SectionDetailsScreen
          getSectionDetailsApi={getSectionDetailsEmpty}
          deleteLocationApi={defaultAsyncState}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('test delete api', () => {
    const sectionDetails: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: mockLocationDetails
      }
    };
    const deleteLocationAPIIsWaiting: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    const deleteLocationAPIError: AsyncState = {
      ...defaultAsyncState,
      error: 'testError'
    };
    const deleteLocationAPIComplete: AsyncState = {
      ...defaultAsyncState,
      result: 'testResult'
    };

    it('test delete api is waiting', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          deleteLocationApi={deleteLocationAPIIsWaiting}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={true}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('test delete api with error', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          deleteLocationApi={deleteLocationAPIError}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={true}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('test delete api is complete', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SectionDetailsScreen
          getSectionDetailsApi={sectionDetails}
          deleteLocationApi={deleteLocationAPIComplete}
          dispatch={jest.fn()}
          navigation={navigationProp}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          scannedEvent={defaultScannedEvent}
          addAPI={defaultAsyncState}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          selectedItem={defaultSelectedItem}
          selectedSection={defaultSection}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('tests functions', () => {
    it('tests handleEditLocation function', () => {
      const mockDispatch = jest.fn();
      const mockNavigate = jest.fn();
      // we need to ignore this typescript error as the navigationProp is expecting serveral properties
      // but we only need to mock the navigate
      // @ts-ignore
      navigationProp = { navigate: mockNavigate };
      const mockSelectedItem = {
        itemNbr: 123,
        itemDesc: 'test',
        price: 2.00,
        upcNbr: '123',
        locationType: 8
      };
      const mockZone = {
        id: 1,
        name: 'A'
      };
      const mockAisle = {
        id: 2,
        name: '1'
      };
      const mockSection = {
        id: 3,
        name: '1'
      };
      handleEditItem(
        mockSelectedItem,
        mockDispatch,
        navigationProp,
        mockZone,
        mockAisle,
        mockSection
      );
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: 'ITEM_DETAILS_SCREEN/SETUP' }));
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: 'LOCATION/SET_SELECTED_LOCATION' }));
      expect(mockDispatch).lastCalledWith({ type: 'LOCATION/HIDE_ITEM_POPUP' });
      expect(mockNavigate).toBeCalledWith('EditLocation');
    });
  });
});
