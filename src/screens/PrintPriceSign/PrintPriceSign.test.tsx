import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import _ from 'lodash';
import ItemDetails from '../../models/ItemDetails';
import { PrintPriceSignScreen, renderSignSizeButtons, validateQty } from './PrintPriceSign';
import getItemDetails from '../../mockData/getItemDetails';
import {
  LaserPaper, Printer, PrinterType
} from '../../models/Printer';
import { strings } from '../../locales';
import { LocationName } from '../../models/Location';

// Something gets into a weird state, and this seems to fix it
jest.useFakeTimers();
jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
describe('PrintPriceSignScreen', () => {
  const defaultError = {
    error: false,
    message: ''
  };
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const defaultScanEvent = {
    value: '123',
    type: 'manual'
  };
  const defaultPrinter: Printer = {
    type: PrinterType.LASER,
    name: 'Front desk printer',
    desc: 'Default',
    id: '123000000000'
  };
  const testItem: ItemDetails = getItemDetails[123];
  const emptyLocation = { id: 0, name: '' };
  const nonemptyLocation = { id: 1, name: 'yes' };

  describe('Tests rendering print Errors/Api responses', () => {
    it(' Renders Loader waiting for Print Service response  ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const printApiIsWaiting = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          result={testItem}
          printAPI={printApiIsWaiting}
          selectedPrinter={defaultPrinter}
          selectedSignType={LaserPaper.XSmall}
          printQueue={[]}
          printingLocationLabels=""
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={1}
          setSignQty={jest.fn()}
          isValidQty={true}
          setIsValidQty={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it(' Renders Print Service Api Error', () => {
      const renderer = ShallowRenderer.createRenderer();
      const printingError = {
        error: true,
        message: strings('PRINT.PRINT_SERVICE_ERROR')
      };
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          result={testItem}
          printAPI={defaultAsyncState}
          selectedPrinter={defaultPrinter}
          selectedSignType={LaserPaper.XSmall}
          printQueue={[]}
          printingLocationLabels=""
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={1}
          setSignQty={jest.fn()}
          isValidQty={true}
          setIsValidQty={jest.fn()}
          error={printingError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it(' Renders OH Update Error for invalid amount of copies ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const invalidSignQty = 101;
      const invalidQty = false;
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          result={testItem}
          printAPI={defaultAsyncState}
          selectedPrinter={defaultPrinter}
          selectedSignType={LaserPaper.XSmall}
          printQueue={[]}
          printingLocationLabels=""
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={invalidSignQty}
          setSignQty={jest.fn()}
          isValidQty={invalidQty}
          setIsValidQty={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  it('renders the Print Price Sign Screen when section labels', () => {
    const renderer = ShallowRenderer.createRenderer();
    const invalidQty = false;
    renderer.render(
      <PrintPriceSignScreen
        scannedEvent={defaultScanEvent}
        exceptionType=""
        actionCompleted={false}
        result={testItem}
        printAPI={defaultAsyncState}
        selectedPrinter={defaultPrinter}
        selectedSignType={LaserPaper.XSmall}
        printQueue={[]}
        printingLocationLabels={LocationName.SECTION}
        selectedAisle={_.cloneDeep(nonemptyLocation)}
        selectedSection={_.cloneDeep(nonemptyLocation)}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        signQty={1}
        setSignQty={jest.fn()}
        isValidQty={invalidQty}
        setIsValidQty={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        useEffectHook={jest.fn()}
        useLayoutHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the Print Price Sign Screen when aisle labels', () => {
    const renderer = ShallowRenderer.createRenderer();
    const invalidQty = false;
    renderer.render(
      <PrintPriceSignScreen
        scannedEvent={defaultScanEvent}
        exceptionType=""
        actionCompleted={false}
        result={testItem}
        printAPI={defaultAsyncState}
        selectedPrinter={defaultPrinter}
        selectedSignType={LaserPaper.XSmall}
        printQueue={[]}
        printingLocationLabels={LocationName.AISLE}
        selectedAisle={_.cloneDeep(nonemptyLocation)}
        selectedSection={_.cloneDeep(nonemptyLocation)}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        signQty={1}
        setSignQty={jest.fn()}
        isValidQty={invalidQty}
        setIsValidQty={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        useEffectHook={jest.fn()}
        useLayoutHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('Tests rendering Price Sign Sizes', () => {
    it(' Renders \'Wine button\' for wine items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const wineItem: ItemDetails = getItemDetails[789];

      renderer.render(
        renderSignSizeButtons(defaultPrinter, wineItem.categoryNbr, 'Wine', jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Wine button should be disabled for non-wine items', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        renderSignSizeButtons(defaultPrinter, testItem.categoryNbr, 'XSmall', jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Large button should be disabled for Portable Printers ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const portablePrinter = {
        type: PrinterType.PORTABLE,
        name: 'Mobile printer',
        desc: 'Default',
        id: '456000000000'
      };
      renderer.render(
        renderSignSizeButtons(portablePrinter, testItem.categoryNbr, 'XSmall', jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests PrintSign copy limit', () => {
    const validCopyAmount = 5;
    const exceedsCopyLimit = 101;
    const belowCopyLimit = 0;
    const minCopyAmount = 1;
    const maxCopyAmount = 100;

    it('ValidateQty should return true for Copy amount(s) between 1 & 100', () => {
      expect(validateQty(validCopyAmount)).toBe(true);
    });
    it('ValidateQty should return true for Minumum amount of Copies (1)', () => {
      expect(validateQty(minCopyAmount)).toBe(true);
    });
    it('ValidateQty should return true for Maximum amount of copies (100)', () => {
      expect(validateQty(maxCopyAmount)).toBe(true);
    });
    it('ValidateQty should return false for Copy amount(s) greater than 100 ', () => {
      expect(validateQty(exceedsCopyLimit)).toBe(false);
    });
    it('ValidateQty should return false for Copy amount(s) less than 1 ', () => {
      expect(validateQty(belowCopyLimit)).toBe(false);
    });
  });
});
