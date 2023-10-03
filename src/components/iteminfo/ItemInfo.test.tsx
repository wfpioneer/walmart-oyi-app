import { NavigationProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ItemInfo, { AdditionalItemDetailsProps, ItemInfoProps, getExceptionTranslation } from './ItemInfo';
import { strings } from '../../locales';
import { WorkListStatus } from '../../models/WorklistItem';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

describe('ItemInfo Component', () => {
  const mockAdditionalItemDetails: AdditionalItemDetailsProps = {
    color: 'red',
    size: 88,
    grossProfit: 2.5,
    vendorPackQty: 33,
    basePrice: 15.05,
    margin: 14,
    viewProfitMargin: true
  };
  const mockItem: ItemInfoProps = {
    itemName: 'Test item',
    itemNbr: 10359,
    upcNbr: '286201035990',
    status: 'Active',
    category: '17-test',
    price: 14,
    exceptionType: 'NSFL',
    additionalItemDetails: mockAdditionalItemDetails,
    countryCode: 'MX',
    showItemImage: false
  };

  describe('Tests rendering ItemInfo', () => {
    it('Renders an Item Info component without additional item details', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ItemInfo
          itemName={mockItem.itemName}
          itemNbr={mockItem.itemNbr}
          upcNbr={mockItem.upcNbr}
          status={mockItem.status || ''}
          category={mockItem.category}
          price={mockItem.price}
          exceptionType={mockItem.exceptionType}
          navigationForPrint={navigationProp}
          additionalItemDetails={{ ...mockAdditionalItemDetails }}
          countryCode={mockItem.countryCode}
          showItemImage={mockItem.showItemImage}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders an Item Info component with additional item details', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(<ItemInfo
        itemName={mockItem.itemName}
        itemNbr={mockItem.itemNbr}
        upcNbr={mockItem.upcNbr}
        status={mockItem.status || ''}
        category={mockItem.category}
        price={mockItem.price}
        exceptionType={mockItem.exceptionType}
        navigationForPrint={navigationProp}
        additionalItemDetails={{ ...mockAdditionalItemDetails }}
        countryCode={mockItem.countryCode}
        showItemImage={mockItem.showItemImage}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders an Item Info component without print print price sign button enabled', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockNavigationProp = undefined;

      renderer.render(<ItemInfo
        itemName={mockItem.itemName}
        itemNbr={mockItem.itemNbr}
        upcNbr={mockItem.upcNbr}
        status={mockItem.status || ''}
        category={mockItem.category}
        price={mockItem.price}
        exceptionType={mockItem.exceptionType}
        navigationForPrint={mockNavigationProp}
        additionalItemDetails={{ ...mockAdditionalItemDetails }}
        countryCode={mockItem.countryCode}
        showItemImage={mockItem.showItemImage}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Item Info Card with AuditWorkList type and InProgress status enabled ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(<ItemInfo
        itemName={mockItem.itemName}
        itemNbr={mockItem.itemNbr}
        upcNbr={mockItem.upcNbr}
        status={mockItem.status || ''}
        category={mockItem.category}
        price={mockItem.price}
        exceptionType={mockItem.exceptionType}
        navigationForPrint={navigationProp}
        additionalItemDetails={{ ...mockAdditionalItemDetails }}
        countryCode={mockItem.countryCode}
        showItemImage={mockItem.showItemImage}
        worklistAuditType="AU"
        worklistStatus={WorkListStatus.AUDITSTARTED}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Tests toggle additional item details through collapsible card', () => {
      const {
        getByTestId, queryAllByTestId
      } = render(
        <ItemInfo
          itemName={mockItem.itemName}
          itemNbr={mockItem.itemNbr}
          upcNbr={mockItem.upcNbr}
          status={mockItem.status || ''}
          category={mockItem.category}
          price={mockItem.price}
          exceptionType={mockItem.exceptionType}
          navigationForPrint={navigationProp}
          additionalItemDetails={{ ...mockAdditionalItemDetails }}
          countryCode={mockItem.countryCode}
          showItemImage={mockItem.showItemImage}
        />
      );
      const collapsibleCard = getByTestId('collapsible-card');
      fireEvent.press(collapsibleCard);
      expect(queryAllByTestId('additional-item-details')).toHaveLength(1);
      fireEvent.press(collapsibleCard);
      expect(queryAllByTestId('additional-item-details')).toHaveLength(0);
    });

    it('Tests print price sign button clickfunctionality in ItemInfo', () => {
      const {
        getByTestId
      } = render(
        <ItemInfo
          itemName={mockItem.itemName}
          itemNbr={mockItem.itemNbr}
          upcNbr={mockItem.upcNbr}
          status={mockItem.status || ''}
          category={mockItem.category}
          price={mockItem.price}
          exceptionType={mockItem.exceptionType}
          navigationForPrint={navigationProp}
          additionalItemDetails={{ ...mockAdditionalItemDetails }}
          countryCode={mockItem.countryCode}
          showItemImage={mockItem.showItemImage}
        />
      );
      const printPriceSignButton = getByTestId('print-price-sign');
      fireEvent.press(printPriceSignButton);
      expect(navigationProp.navigate).toHaveBeenCalledTimes(1);
      expect(navigationProp.navigate).toHaveBeenCalledWith('PrintPriceSign', { screen: 'PrintPriceSignScreen' });
    });
  });

  describe('ItemInfo function tests', () => {
    it('tests getExceptionTranslation function', () => {
      const noTranslation = getExceptionTranslation('NO');
      const nsflTranslation = getExceptionTranslation('NSFL');
      const npTranslation = getExceptionTranslation('NP');
      const nsTranslation = getExceptionTranslation('NS');
      const cTranslation = getExceptionTranslation('C');
      const poTranslation = getExceptionTranslation('PO');
      const nsfqTranslation = getExceptionTranslation('NSFQ');
      const unknownTranslation = getExceptionTranslation(undefined);

      expect(noTranslation).toStrictEqual(strings('EXCEPTION.NEGATIVE_ON_HANDS'));
      expect(nsflTranslation).toStrictEqual(strings('EXCEPTION.NSFL'));
      expect(npTranslation).toStrictEqual(strings('EXCEPTION.NIL_PICK'));
      expect(nsTranslation).toStrictEqual(strings('EXCEPTION.NO_SALES'));
      expect(cTranslation).toStrictEqual(strings('EXCEPTION.CANCELLED'));
      expect(poTranslation).toStrictEqual(strings('EXCEPTION.PO'));
      expect(nsfqTranslation).toStrictEqual(strings('EXCEPTION.NEG_SALES_FLOOR_QTY'));
      expect(unknownTranslation).toStrictEqual(strings('EXCEPTION.UNKNOWN'));
    });
  });
});
