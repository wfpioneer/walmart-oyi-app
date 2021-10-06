import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import FloorItemList from './FloorItemList';
import { mockLocationDetails } from '../../mockData/locationDetails';
import { LocationDetailsItem } from '../../models/LocationItems';

const mockFloorItems = mockLocationDetails.floor;

describe('FloorItemList Component', () => {
  it('Renders a list of FloorItems', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <FloorItemList items={mockFloorItems} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a long list of FloorItems', () => {
    const floorItem = mockFloorItems[0];
    const longFloorItemList: LocationDetailsItem[] = new Array(100).fill(floorItem);
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <FloorItemList items={longFloorItemList} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders an empty list of FloorItems', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <FloorItemList items={[]} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
