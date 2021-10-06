import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockLocationDetails } from '../../mockData/locationDetails';
import ReservePalletRow from './ReservePalletRow';

const mockReservePallet = mockLocationDetails.reserve[0];

describe('ReservePalletRow Component', () => {
  it('Renders a ReservePallet', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ReservePalletRow reservePallet={mockReservePallet} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a ReservePallet with an item with a long name', () => {
    const longItemDesc = new Array(5).fill('An Item With A Very Long Item Description').join(' ');
    const mockFloorItemLongName = { ...mockLocationDetails.floor[0], itemDesc: longItemDesc };
    const mockReservePalletLongFirstItemName = {
      ...mockReservePallet, items: [...mockReservePallet.items, mockFloorItemLongName]
    };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ReservePalletRow reservePallet={mockReservePalletLongFirstItemName} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a ReservePallet with no items', () => {
    const mockReservePalletNoItems = { ...mockReservePallet, items: [] };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ReservePalletRow reservePallet={mockReservePalletNoItems} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
