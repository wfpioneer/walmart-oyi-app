import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockLocationDetails } from '../../mockData/locationDetails';
import { LocationDetailsPallet } from '../../models/LocationItems';
import ReservePalletList from './ReservePalletList';

const mockReservePallets = mockLocationDetails.reserve;

describe('ReservePalletList Component', () => {
  it('Renders a list of ReservePallets', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ReservePalletList reservePallets={mockReservePallets} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a long list of ReservePallets', () => {
    const reservePallet = mockReservePallets[0];
    const longReservePalletList: LocationDetailsPallet[] = new Array(100).fill(reservePallet);
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ReservePalletList reservePallets={longReservePalletList} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders an empty list of ReservePallets', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ReservePalletList reservePallets={[]} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
