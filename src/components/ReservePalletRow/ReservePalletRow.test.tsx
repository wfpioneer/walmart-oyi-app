import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react-native';
import { mockLocationDetails } from '../../mockData/locationDetails';
import ReservePalletRow from './ReservePalletRow';
import { ReserveDetailsPallet, SectionDetailsItem } from '../../models/LocationItems';
import store from '../../state';
import { mockCombinedReserveData } from '../../mockData/getPalletDetails';

const mockReservePallet = mockCombinedReserveData[0];
const mockSection = mockLocationDetails.section;
const mockDispatch = jest.fn();

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn().mockImplementation(() => { }),
    useDispatch: () => mockDispatch
  };
});
jest.mock('../../utils/AppCenterTool.ts', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
describe('ReservePalletRow Component', () => {
  it('Renders a ReservePallet', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ReservePalletRow
          section={mockSection}
          reservePallet={mockReservePallet}
          setPalletClicked={jest.fn()}
          trackEventCall={jest.fn()}
        />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a ReservePallet with an item with a long name', () => {
    const longItemDesc = new Array(5).fill('An Item With A Very Long Item Description').join(' ');
    const mockFloorItemLongName: SectionDetailsItem = {
      ...mockLocationDetails.items.sectionItems[0], itemDesc: longItemDesc
    };
    const mockReservePalletLongFirstItemName: ReserveDetailsPallet = {
      // changed due to items becoming optional on pallet
      ...mockReservePallet, items: [...(mockReservePallet.items || []), mockFloorItemLongName]
    };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ReservePalletRow
          section={mockSection}
          reservePallet={mockReservePalletLongFirstItemName}
          setPalletClicked={jest.fn()}
          trackEventCall={jest.fn()}
        />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a ReservePallet with no items', () => {
    const mockReservePalletNoItems: ReserveDetailsPallet = { ...mockReservePallet, items: [] };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ReservePalletRow
          section={mockSection}
          reservePallet={mockReservePalletNoItems}
          setPalletClicked={jest.fn()}
          trackEventCall={jest.fn()}
        />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('tests click functionality of reserve pallet row', async () => {
    const mockSetPalletClicked = jest.fn();
    const { findByTestId } = render(
      <Provider store={store}>
        <ReservePalletRow
          section={mockSection}
          reservePallet={mockReservePallet}
          setPalletClicked={mockSetPalletClicked}
          trackEventCall={jest.fn()}
        />
      </Provider>
    );
    const reservePalletRow = await findByTestId('reserve-pallet-row');
    fireEvent.press(reservePalletRow);
    expect(mockSetPalletClicked).toBeCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
