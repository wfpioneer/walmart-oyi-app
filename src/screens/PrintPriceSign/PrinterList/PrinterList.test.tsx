import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Printer, PrinterType, PrintingType } from '../../../models/Printer';
import { PrinterList } from './PrinterList';

let navigationProp: NavigationProp<any>;
describe('PrinterList', () => {
  const defaultPrinterList: Printer[] = [{
    type: PrinterType.LASER,
    name: 'Front desk printer',
    desc: 'Default',
    id: '123000000000',
    labelsAvailable: ['price']
  }, {
    type: PrinterType.LASER,
    name: 'Invalid printer',
    desc: 'Default',
    id: '0',
    labelsAvailable: ['price']
  }, {
    type: PrinterType.PORTABLE,
    name: 'Mobile printer',
    desc: 'Default',
    id: '456000000000',
    labelsAvailable: ['price', 'location', 'pallet']
  }];

  const printerList = new PrinterList({
    printerList: defaultPrinterList,
    deleteFromPrinterList: jest.fn(),
    setSelectedPrinter: jest.fn(),
    navigation: navigationProp,
    printingLocationLabels: '',
    printingPalletLabel: false,
    printingType: null,
    setLocationLabelPrinterAction: jest.fn(),
    setPalletLabelPrinterAction: jest.fn(),
    setPriceLabelPrinterAction: jest.fn()
  });

  const printerListLaserDisabled = new PrinterList({
    printerList: defaultPrinterList,
    deleteFromPrinterList: jest.fn(),
    setSelectedPrinter: jest.fn(),
    navigation: navigationProp,
    printingLocationLabels: '',
    printingPalletLabel: false,
    printingType: PrintingType.LOCATION,
    setLocationLabelPrinterAction: jest.fn(),
    setPalletLabelPrinterAction: jest.fn(),
    setPriceLabelPrinterAction: jest.fn()
  });

  it('Renders the delete icon for PrinterIds not equal to 0', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      printerList.printerListCard({ item: defaultPrinterList[0] })
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders printer item card with no delete icon', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      printerList.printerListCard({ item: defaultPrinterList[1] })
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders printer item card that is disabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      printerListLaserDisabled.printerListCard({ item: defaultPrinterList[1] })
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders printer item card that is not disabled when location', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      printerListLaserDisabled.printerListCard({ item: defaultPrinterList[2] })
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders list of Printers in Flatlist ', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PrinterList
        printerList={defaultPrinterList}
        deleteFromPrinterList={jest.fn()}
        setSelectedPrinter={jest.fn()}
        navigation={navigationProp}
        printingLocationLabels=""
        printingPalletLabel={false}
        printingType={null}
        setLocationLabelPrinterAction={jest.fn()}
        setPalletLabelPrinterAction={jest.fn()}
        setPriceLabelPrinterAction={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders list of Printers in Flatlist setting location', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PrinterList
        printerList={defaultPrinterList}
        deleteFromPrinterList={jest.fn()}
        setSelectedPrinter={jest.fn()}
        navigation={navigationProp}
        printingLocationLabels=""
        printingPalletLabel={false}
        printingType={PrintingType.LOCATION}
        setLocationLabelPrinterAction={jest.fn()}
        setPalletLabelPrinterAction={jest.fn()}
        setPriceLabelPrinterAction={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders list of Printers in Flatlist setting price sign', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PrinterList
        printerList={defaultPrinterList}
        deleteFromPrinterList={jest.fn()}
        setSelectedPrinter={jest.fn()}
        navigation={navigationProp}
        printingLocationLabels=""
        printingPalletLabel={false}
        printingType={PrintingType.PRICE_SIGN}
        setLocationLabelPrinterAction={jest.fn()}
        setPalletLabelPrinterAction={jest.fn()}
        setPriceLabelPrinterAction={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders list of Printers in Flatlist setting pallet', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PrinterList
        printerList={defaultPrinterList}
        deleteFromPrinterList={jest.fn()}
        setSelectedPrinter={jest.fn()}
        navigation={navigationProp}
        printingLocationLabels=""
        printingPalletLabel={false}
        printingType={PrintingType.PALLET}
        setLocationLabelPrinterAction={jest.fn()}
        setPalletLabelPrinterAction={jest.fn()}
        setPriceLabelPrinterAction={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
