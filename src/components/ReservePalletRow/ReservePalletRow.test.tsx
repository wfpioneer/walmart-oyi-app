import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import { mockLocationDetails } from '../../mockData/locationDetails';
import ReservePalletRow from './ReservePalletRow';
import { SectionDetailsItem, SectionDetailsPallet } from '../../models/LocationItems';
import store from '../../state';

const mockReservePallet = mockLocationDetails.pallets.palletData[0];
const mockSection = mockLocationDetails.section;

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn().mockImplementation(() => { })
  };
});
describe('ReservePalletRow Component', () => {
  it('Renders a ReservePallet', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ReservePalletRow sectionId={mockSection.id} reservePallet={mockReservePallet} />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a ReservePallet with an item with a long name', () => {
    const longItemDesc = new Array(5).fill('An Item With A Very Long Item Description').join(' ');
    const mockFloorItemLongName: SectionDetailsItem = {
      ...mockLocationDetails.items.sectionItems[0], itemDesc: longItemDesc
    };
    const mockReservePalletLongFirstItemName: SectionDetailsPallet = {
      // changed due to items becoming optional on pallet
      ...mockReservePallet, items: [...(mockReservePallet.items || []), mockFloorItemLongName]
    };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ReservePalletRow sectionId={mockSection.id} reservePallet={mockReservePalletLongFirstItemName} />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a ReservePallet with no items', () => {
    const mockReservePalletNoItems: SectionDetailsPallet = { ...mockReservePallet, items: [] };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ReservePalletRow sectionId={mockSection.id} reservePallet={mockReservePalletNoItems} />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
