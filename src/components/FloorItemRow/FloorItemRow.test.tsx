import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockLocationDetails } from '../../mockData/locationDetails';
import FloorItemRow from './FloorItemRow';

const mockFloorItem = mockLocationDetails.floor[0];

describe('FloorItemRow Component', () => {
  it('Renders a FloorItem', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <FloorItemRow item={mockFloorItem} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a FloorItem with a long name', () => {
    const longItemDesc = new Array(5).fill('An Item With A Very Long Item Description').join(' ');
    const mockFloorItemLongName = { ...mockFloorItem, itemDesc: longItemDesc };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <FloorItemRow item={mockFloorItemLongName} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
