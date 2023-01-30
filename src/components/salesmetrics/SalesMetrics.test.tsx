import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import SalesMetrics from './SalesMetrics';
import { trackEvent } from '../../utils/AppCenterTool';

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useDispatch: () => mockDispatch
  };
});

describe('SalesMetrics component', () => {
  const mockPiSale = {
    dailyAvgSales: 0.0,
    weeklyAvgSales: 0.0,
    daily: [
      { day: '2023-01-25T00:00:00.000Z', value: 0 },
      { day: '2023-01-24T00:00:00.000Z', value: 0 },
      { day: '2023-01-23T00:00:00.000Z', value: 0 },
      { day: '2023-01-22T00:00:00.000Z', value: 0 },
      { day: '2023-01-21T00:00:00.000Z', value: 0 },
      { day: '2023-01-20T00:00:00.000Z', value: 0 },
      { day: '2023-01-19T00:00:00.000Z', value: 0 }
    ],
    weekly: [
      { week: 51, value: 5 },
      { week: 50, value: 3 },
      { week: 49, value: 2 },
      { week: 48, value: 0 },
      { week: 47, value: 1 }
    ],
    lastUpdateTs: ''
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders the SalesMetrics with isGraphView false', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <SalesMetrics
        itemNbr={1234}
        itemSalesHistory={mockPiSale}
        isGraphView={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the SalesMetrics with isGraphView true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <SalesMetrics
        itemNbr={1234}
        itemSalesHistory={mockPiSale}
        isGraphView={true}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the SalesMetrics with isGraphView true and weekly view', async () => {
    const { toJSON, getByTestId } = render(
      <SalesMetrics
        itemNbr={1234}
        itemSalesHistory={mockPiSale}
        isGraphView={true}
      />
    );
    const weeklyViewBtn = getByTestId('weeklyViewBtn');
    fireEvent.press(await weeklyViewBtn);

    expect(trackEvent).toBeCalledWith(
      'item_details_sales_metrics_change_period',
      { itemNbr: 1234, itemSalesHistory: JSON.stringify(mockPiSale), isDaily: false }
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the SalesMetrics with isGraphView false and weekly view', async () => {
    const { toJSON, getByTestId } = render(
      <SalesMetrics
        itemNbr={1234}
        itemSalesHistory={mockPiSale}
        isGraphView={false}
      />
    );
    const weeklyViewBtn = getByTestId('weeklyViewBtn');
    fireEvent.press(await weeklyViewBtn);

    expect(trackEvent).toBeCalledWith(
      'item_details_sales_metrics_change_period',
      { itemNbr: 1234, itemSalesHistory: JSON.stringify(mockPiSale), isDaily: false }
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
