import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import store from '../../state';
import { mockLocationDetails } from '../../mockData/locationDetails';
import FloorItemRow from './FloorItemRow';

const mockFloorItem = mockLocationDetails.items.sectionItems[0];
let navigationProp: NavigationProp<any>;

describe('FloorItemRow Component', () => {
  it('Renders a FloorItem', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <FloorItemRow item={mockFloorItem} dispatch={jest.fn()} navigation={navigationProp} />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a FloorItem with a long name', () => {
    const longItemDesc = new Array(5).fill('An Item With A Very Long Item Description').join(' ');
    const mockFloorItemLongName = { ...mockFloorItem, itemDesc: longItemDesc };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <FloorItemRow item={mockFloorItemLongName} dispatch={jest.fn()} navigation={navigationProp} />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
