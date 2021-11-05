import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Header, LocationTabsNavigator } from './LocationTabNavigator';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate
    })
  };
});
describe('Test Location Tabs', () => {
  it('Renders Location Tabs with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      floor, reserve, zone, aisle, section
    } = mockLocationDetails;
    renderer.render(
      <LocationTabsNavigator
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        locationPopupVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      floor, reserve, zone, aisle, section
    } = mockLocationDetailsEmpty;
    renderer.render(
      <LocationTabsNavigator
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        locationPopupVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Large Location Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      floor, reserve, zone, aisle, section
    } = mockLocationDetailsLargeLocationCount;
    renderer.render(
      <LocationTabsNavigator
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        locationPopupVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders items Header', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Header headerText="ITEMS" isReserve={false} isEditEnabled={true} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders pallet Header', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Header headerText="PALLETS" isReserve={true} isEditEnabled={true} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
